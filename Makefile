ifneq (,$(wildcard ./.env))
	include .env
	export
endif

.PHONY: help db-up db-down db-migrate db-status

help:
	@echo "Available targets:"
	@echo "  make db-up"
	@echo "  make db-down"
	@echo "  make db-migrate"
	@echo "  make db-status"

db-up:
	docker compose up -d postgres mailpit

db-down:
	docker compose down

db-migrate:
	yarn db:migrate

db-status:
	yarn db:status

