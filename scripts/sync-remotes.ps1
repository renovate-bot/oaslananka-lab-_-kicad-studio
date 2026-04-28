$ErrorActionPreference = "Stop"

if (-not (git remote get-url origin 2>$null)) {
  git remote add origin "git@github.com:oaslananka/kicad-studio.git"
}
if (-not (git remote get-url org 2>$null)) {
  git remote add org "git@github.com:oaslananka-lab/kicad-studio.git"
}

git push origin --all
git push origin --tags
git push org --all
git push org --tags
