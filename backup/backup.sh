#!/bin/bash

set -e

DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR=/backups
FILENAME="gugukun_${DATE}.sql.gz"

echo "Backup started at $(date)"

PGPASSWORD=$POSTGRES_PASSWORD pg_dump -h $DB_HOST -U $POSTGRES_USER $POSTGRES_DB \
  | gzip > "$BACKUP_DIR/$FILENAME"

# 保留 7 天的備份
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed at $(date)"