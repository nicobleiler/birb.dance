# birb.dance
[![Website Status](https://uptime.bleiler.dev/api/badge/41/uptime?labelPrefix=Demo+)](https://birb.dance)
[![Build Status GitHub Actions](https://img.shields.io/github/actions/workflow/status/nicobleiler/birb.dance/docker-publish.yml.svg)](https://github.com/nicobleiler/birb.dance/actions/workflows/docker-publish.yml)
[![Docker Pulls](https://img.shields.io/docker/pulls/nicobleiler/birb.dance.svg)](https://hub.docker.com/r/nicobleiler/birb.dance)
[![Docker Stars](https://img.shields.io/docker/stars/nicobleiler/birb.dance.svg?maxAge=2592000)](https://hub.docker.com/r/nicobleiler/birb.dance/)
[![GitHub Issues](https://img.shields.io/github/issues-raw/nicobleiler/birb.dance.svg)](https://github.com/nicobleiler/birb.dance/issues)
[![buymeacoffee](https://img.shields.io/badge/Donate-Buy%20me%20a%20coffee-orange.svg)](https://www.buymeacoffee.com/nicobleiler)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/nicobleiler/birb.dance/blob/master/LICENSE.md)

An initiative, inspired by [`parrot.live`](https://github.com/hugomd/parrot.live), to allow any computer with `curl` to display _animated_ birbs.
Additionally you view a simulated terminal in the `browser` [`birb.dance`](https://birb.dance) to enjoy all the birbs you could ever want.

# Try it!
```bash
curl birb.dance
# Use extra options to change fps, birb or flip the birb
curl birb.dance/parrot?fps=5
# To use multiple options at the same time you have to escape the `&` or put the whole url in quotes
curl birb.dance/parrot?fps=5\&flipped
curl "birb.dance/parrot?fps=5&flipped"
```

# :partybirb:
<div align="center">
  <img src='https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmVoMnVrNHVieHBtYjRhcjVsODJ5YjFyZXdwczJrcGVuN2F4NDMyOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/v9wpxJDQ2LPq52OMlJ/giphy.gif' />
</div>

# Thanks
* [hugomd](https://github.com/hugomd) for [`parrot.live`](https://github.com/hugomd/parrot.live), and for idea

# More Birbs
* [`cultofthepartyparrot.com`](http://cultofthepartyparrot.com/)
* [`terminal-parrot`](https://github.com/jmhobbs/terminal-parrot)
* [`parrotsay`](https://github.com/matheuss/parrotsay)
* [`ascii.live`](https://github.com/hugomd/ascii.live)
