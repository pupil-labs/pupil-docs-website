#!/bin/bash
#
# This script is written according to Google Shell Style Guide
# ref. https://google.github.io/styleguide/shell.xml
#
################################################################################
# Assign default variables
# Arguments:
#   Script Arguments
# Returns:
#   None
################################################################################
variables_func() {
  BRANCHES="master"
  EXCLUDE="logo.png|navbar.png|\.ico"
  OUTFILE="config-tags.toml"
  PATTERN=".md|.jpg|.jpeg|.pdf|.svg|.gif|.mp4|.webm|.webp"
  SOURCE="config.toml"
  TAGNUM="3"
  WORKDIR="content/"
} # variables_func()

################################################################################
# Parse options
# Arguments:
#   Script Arguments
# Returns:
#   None
################################################################################
options_func() {
  while getopts "b:e:ho:p:s:t:w:" OPTION
  do
    case "${OPTION}" in
      b) BRANCHES="${OPTARG}" ;;
      e) EXCLUDE="${OPTARG}" ;;
      o) OUTFILE="${OPTARG}" ;; 
      p) PATTERN="${OPTARG}" ;;
      s) SOURCE="${OPTARG}" ;;
      t) TAGNUM="${OPTARG}" ;;
      w) WORKDIR="${OPTARG}" ;;
      h) usage_func ;;
      ?) usage_func ;;
      *) usage_func ;;
    esac
  done
  for branch in ${BRANCHES} ; do tags+="${branch}"$'\n' ; done
  readonly OUTFILE=$(abs "${OUTFILE}")
  readonly SOURCE=$(abs "${SOURCE}")
  readonly WORKDIR=$(abs "${WORKDIR}")
} # options_func()

################################################################################
# Prints usage for this script
# Arguments:
#   None
# Returns:
#   None
################################################################################
usage_func() {
  echo "Usage: $0 [-b BRANCHES] [-e PATTERN] [-o FILE] [-p PATTERN] [-s FILE]
                  [-t NUMBER] [-w DIR]

  -h               Print this help
  -b BRANCHES      Set branches to include.
                   Separtor is space.               Default: master

  -e PATTERN       Exclude following files.         Default: logo.png|navbar.png
  -o FILE          Set output file.                 Default: ./config-tags.toml
  -p PATTERN       Set grep pattern for file match. Default: 
                                                      .md|.jpg|.jpeg|.png|.pdf

  -s FILE          Set source file.                 Default: ./config.toml
  -t NUMBER        Set number of tags to use.       Default: 3
  -w DIR           Set working directory.           Default: content/

" >&2
  exit 1
} # usage_func()

################################################################################
# Absolute path to file
# Arguments:
#   String
# Returns:
#   String
################################################################################
abs() {
  echo "$(cd "$(dirname "${@}")" && pwd -P)/$(basename "${@}")"
} # abs()

################################################################################
# Prints error message and exits script
# Arguments:
#   String
# Returns:
#   None
################################################################################
err() {
  echo -e "[$(date +'%Y-%m-%dT%H:%M:%S%z')]: ${@}\n" >&2
  exit 1
} # err()

main () {
  variables_func "$@"
  options_func "$@"
  cd "${WORKDIR}" || err "Error accessing working directory"
  test -r "${SOURCE}" || err "File ${SOURCE} not readable"
  if ! [[ ${TAGNUM} -eq ${TAGNUM} ]] ; then 
    err "Error! Tag count is not a number"
  fi
  tags=$(git tag -l | sort -V | tail -n "${TAGNUM}")
  tags+='\n'"${BRANCHES}"
  tags=$(echo -e "${tags}" | sed -e "/^\s*$/d")
  latestTag=$(echo "${tags##*$'\n'}" | tr -d '.')
  echo -e "all tags: ${tags}"
  echo -e "latest tag: ${latestTag}"

  tagsCount=$(echo $(wc -l <<< "${tags}"))
  body=$(cat "${SOURCE}")
  body+="\n\ndefaultContentLanguage = \"master\"\n\n[Languages]\n"
  for tag in ${tags}
    do 
      stripTag=$(echo "${tag}" | tr -d '.')
      git checkout -f "${tag}" 2>/dev/null || 
        err "Tag or Branch ${tag} doesn't exist."
      files=$(git ls-tree --name-only --full-tree -r ${tag} | 
            egrep "${PATTERN}" | egrep -v "${EXCLUDE}")
      while read line
        do
          filename="${line%.*}"
          extension="${line##*.}"
          mv -f "${line}" "${filename}.${stripTag}.${extension}" ||
            err "Cannot move file ${line}"
        done <<< "${files}"
      for eachMd in $(find ./ -name "*${stripTag}.md")
        do
          while read eachFile
            do
              relPath=${eachFile%.*} 
              filename="${relPath##*/}"
              extension="${eachFile##*.}"
              what="${filename}\.${extension}"
              withwhat="${filename}\.${stripTag}\.${extension}"
              perl -pi -e "s/${what}/${withwhat}/g" "${eachMd}"
            done <<< "${files}"
        done
      body+="[Languages.${stripTag}]\nweight = ${tagsCount}\n"
      body+="title = \"Pupil Docs - ${tag}\"\n\n"
      tagsCount=$((tagsCount-1))
    done
    body+="[params]\nsearch = true\n"
  echo -e "${body}" > "${OUTFILE}" || err "Cannot write to ${OUTFILE}"
} # main() 

main "$@"
