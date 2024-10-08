default:
    @just --list

# rsync to production (7bit.org)
deploy:
    rsync -avzhP public/ hardforze.binarytrance.com:infrastructure/volumes/www/7bit.org/

# rsync to production (www.7bit.org)
deploy_www:
    rsync -avzhP www.7bit.org/ hardforze.binarytrance.com:infrastructure/volumes/www/www.7bit.org/
