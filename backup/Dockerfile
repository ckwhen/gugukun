FROM postgres:16

RUN apt-get update && apt-get install -y cron gzip

COPY backup.sh /backup.sh
RUN chmod +x /backup.sh

# 每天凌晨 3 點備份
RUN echo "0 3 * * * /backup.sh >> /var/log/cron.log 2>&1" > /etc/cron.d/backup-cron
RUN chmod 0644 /etc/cron.d/backup-cron
RUN crontab /etc/cron.d/backup-cron

CMD ["cron", "-f"]