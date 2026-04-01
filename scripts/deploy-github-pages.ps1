param(
  [switch]$BuildOnly,
  [switch]$SkipChecks
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$script:BuildDirectoryName = '.deploy-gh-pages'
$script:PagesBranchName = 'gh-pages'

<#
  Resolve the repository root from the current script location.
  The script lives under `scripts`, so the parent directory is the project root.
  Every later command uses this path to avoid relative-path issues.
#>
function Get-RepositoryRoot {
  return Split-Path -Parent $PSScriptRoot
}

<#
  Run an external command in a specific working directory and stop on failure.
  External tools do not automatically throw PowerShell exceptions, so this helper
  checks `$LASTEXITCODE` and raises a readable error when something fails.
#>
function Invoke-ExternalCommand {
  param(
    [Parameter(Mandatory = $true)]
    [string]$FilePath,

    [Parameter(Mandatory = $true)]
    [string[]]$Arguments,

    [Parameter(Mandatory = $true)]
    [string]$WorkingDirectory
  )

  Push-Location $WorkingDirectory

  try {
    & $FilePath @Arguments

    if ($LASTEXITCODE -ne 0) {
      $joinedArguments = $Arguments -join ' '
      throw "Command failed: $FilePath $joinedArguments"
    }
  }
  finally {
    Pop-Location
  }
}

<#
  Read the current Git origin URL.
  GitHub Pages metadata such as the base path and preview URL come from the origin remote,
  so this script requires a valid GitHub origin before it can build or deploy.
#>
function Get-OriginRemoteUrl {
  param(
    [Parameter(Mandatory = $true)]
    [string]$RepositoryRoot
  )

  Push-Location $RepositoryRoot

  try {
    $remoteUrl = (git remote get-url origin).Trim()
  }
  finally {
    Pop-Location
  }

  if ([string]::IsNullOrWhiteSpace($remoteUrl)) {
    throw 'Could not read Git origin. Configure a GitHub remote first.'
  }

  return $remoteUrl
}

<#
  Parse the GitHub remote and derive Pages metadata.
  User sites like `owner.github.io` deploy at `/`.
  Normal project repositories deploy at `/{repo}/`.
  The result is used for the Vite base path and the final preview URL.
#>
function Get-GitHubPagesMetadata {
  param(
    [Parameter(Mandatory = $true)]
    [string]$RemoteUrl
  )

  $owner = ''
  $repo = ''

  if ($RemoteUrl -match "^https://github\.com/(?<owner>[^/]+)/(?<repo>[^/]+?)(?:\.git)?/?$") {
    $owner = $Matches.owner
    $repo = $Matches.repo
  }
  elseif ($RemoteUrl -match "^git@github\.com:(?<owner>[^/]+)/(?<repo>[^/]+?)(?:\.git)?$") {
    $owner = $Matches.owner
    $repo = $Matches.repo
  }
  else {
    throw "Unsupported GitHub remote: $RemoteUrl"
  }

  $isUserSite = $repo -ieq "$owner.github.io"
  $basePath = if ($isUserSite) { '/' } else { "/$repo/" }
  $previewUrl = if ($isUserSite) { "https://$owner.github.io/" } else { "https://$owner.github.io/$repo/" }

  return @{
    Owner = $owner
    Repo = $repo
    BasePath = $basePath
    PreviewUrl = $previewUrl
  }
}

<#
  Remove the previous Pages build directory.
  The script uses a dedicated `.deploy-gh-pages` folder instead of the normal `dist`
  to avoid file-lock conflicts with local preview output.
#>
function Reset-BuildDirectory {
  param(
    [Parameter(Mandatory = $true)]
    [string]$BuildDirectory
  )

  if (Test-Path $BuildDirectory) {
    Remove-Item -Path $BuildDirectory -Recurse -Force
  }
}

<#
  Run release checks before building.
  By default the script executes type checking and linting to prevent publishing
  an obviously broken build. The caller can skip this for troubleshooting only.
#>
function Invoke-PreflightChecks {
  param(
    [Parameter(Mandatory = $true)]
    [string]$RepositoryRoot
  )

  Invoke-ExternalCommand -FilePath 'pnpm.cmd' -Arguments @('typecheck') -WorkingDirectory $RepositoryRoot
  Invoke-ExternalCommand -FilePath 'pnpm.cmd' -Arguments @('lint') -WorkingDirectory $RepositoryRoot
}

<#
  Build the GitHub Pages output and add required static files.
  The script copies `index.html` to `404.html` for SPA fallback and writes
  `.nojekyll` so GitHub Pages serves the build without Jekyll interference.
#>
function Invoke-GitHubPagesBuild {
  param(
    [Parameter(Mandatory = $true)]
    [string]$RepositoryRoot,

    [Parameter(Mandatory = $true)]
    [string]$BuildDirectory,

    [Parameter(Mandatory = $true)]
    [hashtable]$PagesMetadata,

    [Parameter(Mandatory = $true)]
    [bool]$ShouldSkipChecks
  )

  Reset-BuildDirectory -BuildDirectory $BuildDirectory

  if (-not $ShouldSkipChecks) {
    Invoke-PreflightChecks -RepositoryRoot $RepositoryRoot
  }

  Invoke-ExternalCommand -FilePath 'pnpm.cmd' -Arguments @('exec', 'tsc', '-b') -WorkingDirectory $RepositoryRoot
  Invoke-ExternalCommand -FilePath 'pnpm.cmd' -Arguments @(
    'exec',
    'vite',
    'build',
    '--base',
    $PagesMetadata.BasePath,
    '--outDir',
    $BuildDirectory
  ) -WorkingDirectory $RepositoryRoot

  Copy-Item -Path (Join-Path $BuildDirectory 'index.html') -Destination (Join-Path $BuildDirectory '404.html') -Force
  New-Item -Path (Join-Path $BuildDirectory '.nojekyll') -ItemType File -Force | Out-Null
}

<#
  Publish the built output to the remote `gh-pages` branch.
  This happens inside the build directory, so the main working tree and branch
  stay untouched while the static output is force-pushed as a clean site branch.
#>
function Publish-GitHubPagesBuild {
  param(
    [Parameter(Mandatory = $true)]
    [string]$BuildDirectory,

    [Parameter(Mandatory = $true)]
    [string]$RemoteUrl,

    [Parameter(Mandatory = $true)]
    [string]$RepositoryRoot
  )

  $gitUserName = (git -C $RepositoryRoot config user.name).Trim()
  $gitUserEmail = (git -C $RepositoryRoot config user.email).Trim()

  if ([string]::IsNullOrWhiteSpace($gitUserName) -or [string]::IsNullOrWhiteSpace($gitUserEmail)) {
    throw 'Could not read git user.name or user.email.'
  }

  $temporaryGitDirectory = Join-Path $BuildDirectory '.git'

  if (Test-Path $temporaryGitDirectory) {
    Remove-Item -Path $temporaryGitDirectory -Recurse -Force
  }

  Invoke-ExternalCommand -FilePath 'git' -Arguments @('init') -WorkingDirectory $BuildDirectory
  Invoke-ExternalCommand -FilePath 'git' -Arguments @('checkout', '-B', $script:PagesBranchName) -WorkingDirectory $BuildDirectory
  Invoke-ExternalCommand -FilePath 'git' -Arguments @('config', 'user.name', $gitUserName) -WorkingDirectory $BuildDirectory
  Invoke-ExternalCommand -FilePath 'git' -Arguments @('config', 'user.email', $gitUserEmail) -WorkingDirectory $BuildDirectory
  Invoke-ExternalCommand -FilePath 'git' -Arguments @('add', '-A') -WorkingDirectory $BuildDirectory
  Invoke-ExternalCommand -FilePath 'git' -Arguments @('commit', '-m', 'Deploy GitHub Pages') -WorkingDirectory $BuildDirectory
  Invoke-ExternalCommand -FilePath 'git' -Arguments @('remote', 'add', 'origin', $RemoteUrl) -WorkingDirectory $BuildDirectory
  Invoke-ExternalCommand -FilePath 'git' -Arguments @('push', '--force', 'origin', $script:PagesBranchName) -WorkingDirectory $BuildDirectory
}

<#
  Print the final result summary.
  The most useful information after running the script is where the output is stored,
  what the preview URL is, and whether the run only built or also deployed.
#>
function Write-ResultSummary {
  param(
    [Parameter(Mandatory = $true)]
    [hashtable]$PagesMetadata,

    [Parameter(Mandatory = $true)]
    [string]$BuildDirectory,

    [Parameter(Mandatory = $true)]
    [bool]$WasBuildOnly
  )

  Write-Host ''
  Write-Host "GitHub Pages build directory: $BuildDirectory"
  Write-Host "GitHub Pages preview URL: $($PagesMetadata.PreviewUrl)"

  if ($WasBuildOnly) {
    Write-Host 'Build completed. Nothing was pushed to gh-pages.'
    return
  }

  Write-Host 'Deploy completed. The site was pushed to gh-pages.'
  Write-Host 'If this is the first Pages deployment, set Settings > Pages to gh-pages / root.'
}

$repositoryRoot = Get-RepositoryRoot
$remoteUrl = Get-OriginRemoteUrl -RepositoryRoot $repositoryRoot
$pagesMetadata = Get-GitHubPagesMetadata -RemoteUrl $remoteUrl
$buildDirectory = Join-Path $repositoryRoot $script:BuildDirectoryName

Invoke-GitHubPagesBuild -RepositoryRoot $repositoryRoot -BuildDirectory $buildDirectory -PagesMetadata $pagesMetadata -ShouldSkipChecks $SkipChecks.IsPresent

if (-not $BuildOnly.IsPresent) {
  Publish-GitHubPagesBuild -BuildDirectory $buildDirectory -RemoteUrl $remoteUrl -RepositoryRoot $repositoryRoot
}

Write-ResultSummary -PagesMetadata $pagesMetadata -BuildDirectory $buildDirectory -WasBuildOnly $BuildOnly.IsPresent
