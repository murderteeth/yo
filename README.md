# yo
The bot that helps you manage your assets with Yearn Finance.

![image](https://github.com/murderteeth/yo/assets/89237203/457188d4-bcf5-45a3-bb14-b8a48a091bed)


#### requirements
make, bun, tmux


## lfg
```sh
cp .env.example .env
# configure .env
make dev
```


## test
```sh
bun test
bun test --only
```


### tmux
**quit** - `ctrl+b`, `:` then `kill-session` (your dev environment will also shutdown gracefully)

**pane navigation** - `ctrl+b` then `arrow keys`

**zoom\unzoom pane** - `ctrl+b` then `z`

**scroll** - `ctrl+b` then `[` then `arrow keys` or `page up\down keys` then `q` to quit scroll mode

**more** - [tmux shortcuts & cheatsheet](https://gist.github.com/MohamedAlaa/2961058)

