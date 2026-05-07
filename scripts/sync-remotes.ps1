$RepoName = "kicad-studio"
$PersonalOwner = "oaslananka"
$OrgOwner = "oaslananka-lab"

$remotes = git remote
if ($remotes -notcontains "lab") {
    git remote add lab "https://github.com/$OrgOwner/$RepoName.git"
}

if ($remotes -notcontains "personal") {
    git remote add personal "https://github.com/$PersonalOwner/$RepoName.git"
}

Write-Host "Fetching canonical org and personal showcase remotes..."
git fetch lab --prune
git fetch personal --prune

Write-Host "Canonical push target: lab ($OrgOwner/$RepoName)"
Write-Host "Personal showcase mirroring is handled by .github/workflows/mirror-personal.yml after org changes land."
