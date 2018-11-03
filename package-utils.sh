# colours
source util-echo_colours.sh
# DEFAULT, BLACK, DARK_GRAY, RED, LIGHT_RED, GREEN, LIGHT_GREEN, BROWN, YELLOW,
# BLUE, LIGHT_BLUE, PURPLE, LIGHT_PURPLE, CYAN, LIGHT_CYAN, LIGHT_GRAY, WHITE

# package utilities

# report usage error
if [ 1 -gt $# ]; then
	printf " ${RED} > ${CYAN} usage:${DEFAULT}\n"
	printf " ${RED} >> ${CYAN} package-utils.sh mkdir-unit ...${DEFAULT} "
fi

if [ $# -gt 0 ]; then

	# create directory for client unit tests
	if [ $1 = 'mkdir-unit' ]; then
		mkdir ./logs/unit/
	fi

fi
