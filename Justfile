default:
    @just --list

# rsync to production
deploy:
    rsync -avzhP --delete public/ hardforze.binarytrance.com:infrastructure/volumes/www/7bit.org/
