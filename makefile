.PHONY: clean

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
clean:
	docker stop ${CONTAINER_NAME}
