.PHONY: clean, reset

CONTAINER_NAME := chat-app-db
DB_PORT := 3400
DB_NAME := chat-app

all:
	docker run --rm -itd \
		-v "${shell pwd}/.volumes:/data/db" \
		-v "${shell pwd}/.data:/test" \
		-p ${DB_PORT}:27017 \
		--name ${CONTAINER_NAME} \
		mongo
entry:
	docker exec -it ${CONTAINER_NAME} /bin/bash
reset-message:
	docker exec  -it ${CONTAINER_NAME} mongoimport \
		--db=$(DB_NAME) \
		--collection=messages \
		--drop \
		--jsonArray /test/message.json
reset-user:
	docker exec  -it ${CONTAINER_NAME} mongoimport \
		--db=$(DB_NAME) \
		--collection=users \
		--drop \
		--jsonArray /test/user.json
reset: reset-message reset-user
	echo "Reset DB"

clean:
	docker stop ${CONTAINER_NAME}
