# birb.dance
[![Build Status GitHub Actions](https://img.shields.io/github/actions/workflow/status/nicobleiler/birb.dance/docker-publish.yml.svg)](https://github.com/nicobleiler/birb.dance/actions/workflows/docker-publish.yml)
[![Docker Pulls](https://img.shields.io/docker/pulls/nicobleiler/birb.dance.svg)](https://hub.docker.com/r/nicobleiler/birb.dance)
[![Docker Stars](https://img.shields.io/docker/stars/nicobleiler/birb.dance.svg?maxAge=2592000)](https://hub.docker.com/r/nicobleiler/birb.dance/)
[![GitHub Issues](https://img.shields.io/github/issues-raw/nicobleiler/birb.dance.svg)](https://github.com/nicobleiler/birb.dance/issues)
[![buymeacoffee](https://img.shields.io/badge/Donate-Buy%20me%20a%20coffee-orange.svg)](https://www.buymeacoffee.com/nicobleiler)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/nicobleiler/birb.dance/blob/master/LICENSE.md)

An initiative, using code from [`parrot.live`](https://github.com/hugomd/parrot.live), to allow any computer with `curl` to display _animated_ birbs.

# Try it!
```bash
curl birb.dance
# Use extra options to change fps, birb or flip the birb
curl birb.dance/parrot?fps=5
# To use multiple options at the same time you have to escape the `&` or put the whole url in quotes
curl birb.dance/parrot?fps=5\&flipped=true
curl "birb.dance/parrot?fps=5&flipped=true"
```

# :partybirb:
<div align="center">
  <img src='https://github.com/nicobleiler/birb.dance/blob/master/docs/birb.dance.gif' />
</div>

# Thanks
* [hugomd](https://github.com/hugomd) for [`parrot.live`](https://github.com/hugomd/parrot.live), and for the code

# More Birbs
* [cultofthepartyparrot.com](http://cultofthepartyparrot.com/)
* [`terminal-parrot`](https://github.com/jmhobbs/terminal-parrot)
* [`parrotsay`](https://github.com/matheuss/parrotsay)
* [`ascii.live`](https://github.com/hugomd/ascii.live)
