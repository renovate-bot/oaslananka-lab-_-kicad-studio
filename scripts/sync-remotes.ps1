$RepoName = "kicad-studio"
$Owner = "oaslananka"
$Org = "oaslananka-lab"

# Ensure personal remote
$remotes = git remote
if ($remotes -notcontains "personal") {
    git remote add personal "https://github.com/$Owner/$RepoName.git"
}

# Ensure org remote
if ($remotes -notcontains "org") {
    git remote add org "https://github.com/$Org/$RepoName.git"
}

Write-Host "Fetching all..."
git fetch --all

Write-Host "Pushing to personal..."
git push personal --all --tags

Write-Host "Pushing to org..."
git push org --all --tags

Write-Host "Sync complete."
