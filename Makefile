all:
	@echo "Available targets:"
	@echo "- deploy"

deploy:
	rsync -avzhP --delete public/ hardforze.binarytrance.com:infrastructure/volumes/www/7bit.org/
