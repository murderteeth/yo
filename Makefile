
dev:
	bun install

	@tmux new-session -d -s devenv

	# Layout panes
	@tmux splitw -v -p 50

	# Run commands
	@tmux send-keys -t devenv:0.0 'bun dev' C-m

	@tmux selectp -t 1
	@tmux attach-session -t devenv


down:
	-@tmux kill-server
