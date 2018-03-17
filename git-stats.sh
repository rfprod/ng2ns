# colours
source util-echo_colours.sh
# DEFAULT, BLACK, DARK_GRAY, RED, LIGHT_RED, GREEN, LIGHT_GREEN, BROWN, YELLOW,
# BLUE, LIGHT_BLUE, PURPLE, LIGHT_PURPLE, CYAN, LIGHT_CYAN, LIGHT_GRAY, WHITE

# check if dependencies are installed
DEPS=$(sudo npm list -g --depth=0)
printf " ${GREEN} > installed deps: ${DEFAULT} ${DEPS} \n"

if grep -q git-stats@ <<<$DEPS; then
	printf " ${BLUE} > dependency check: ${GREEN}git-stats installed ${DEFAULT}\n"
else
	sudo npm install -g git-stats@latest
fi

if grep -q git-stats-importer@ <<<$DEPS; then
	printf " ${BLUE} > dependency check: ${GREEN}git-stats-importer installed ${DEFAULT}\n"
else
	sudo npm install -g git-stats-importer@latest
fi

# initialize .git-stats file
printf "{\n  \"commits\": {\n    }\n}" > ~/.git-stats

# import repository history
git-stats-importer -e zoidenmacht@zoho.com

# save git-stats as a html file
echo '<html><body><pre>' > ./logs/git-stats.html
git-stats --since "17 July 2017" -n >> ./logs/git-stats.html
echo '</pre></body></html>' >> ./logs/git-stats.html

printf "${GREEN}GIT-STATS CALENDAR GENERATED${DEFAULT}\n"
