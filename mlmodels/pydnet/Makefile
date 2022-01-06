.PHONY: clean help install lint requirements pretrained kitti
.DEFAULT_GOAL := help
ROOT := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

## Install Python Dependencies
requirements:
	pip install -U pip setuptools wheel
	pip install -r requirements.txt

## Delete all compiled Python files
clean:
	find . -type f -name "*.py[co]" -delete
	find . -type d -name "__pycache__" -delete

## Lint using flake8
lint:
	flake8 src

## Install PyDNet package
install: requirements
	pip install .

## Download pretrained PyDNet
pretrained: requirements
	python ./src/cli/download_google_drive.py 1Zu41tHv89q_F7N5KFigzyUY5vAc8ufQL $(ROOT)/data/checkpoint/pydnet

## Download KITTI-360 dataset
kitti: requirements
	AWS_REGION = s3.eu-central-1.amazonaws.com;\
	for ENTRY in "2013_05_28_drive_0000_sync" "2013_05_28_drive_0002_sync" "2013_05_28_drive_0005_sync" "2013_05_28_drive_0006_sync" "2013_05_28_drive_0007_sync" "2013_05_28_drive_0009_sync" "2013_05_28_drive_0010_sync"; do\
		PATH = KITTI-360/data_3d_raw;\
		FILE = $${ENTRY}_velodyne.zip;\
		python ./src/cli/download_aws_s3.py $${AWS_REGION} avg-projects/$${PATH}/$${FILE} $(ROOT)/data/mount/$${PATH}/;\
		for CAMERA in "00" "01"; do\
			PATH = KITTI-360/data_2d_raw;\
			FILE = $${ENTRY}_image_$${CAMERA}.zip;\
			python ./src/cli/download_aws_s3.py $${AWS_REGION} avg-projects/$${PATH}/$${FILE} $(ROOT)/data/mount/$${PATH}/;\
		done;\
	done;\
	PATH = KITTI-360/data_3d_raw;\
	FILE = data_timestamps_velodyne.zip;\
	python ./src/cli/download_aws_s3.py $${AWS_REGION} avg-projects/$${PATH}/$${FILE} $(ROOT)/data/mount/$${PATH}/

help:
	@echo "$$(tput bold)Available rules:$$(tput sgr0)"
	@echo
	@sed -n -e "/^## / { \
		h; \
		s/.*//; \
		:doc" \
		-e "H; \
		n; \
		s/^## //; \
		t doc" \
		-e "s/:.*//; \
		G; \
		s/\\n## /---/; \
		s/\\n/ /g; \
		p; \
	}" ${MAKEFILE_LIST} \
	| LC_ALL='C' sort --ignore-case \
	| awk -F '---' \
		-v ncol=$$(tput cols) \
		-v indent=19 \
		-v col_on="$$(tput setaf 6)" \
		-v col_off="$$(tput sgr0)" \
	'{ \
		printf "%s%*s%s ", col_on, -indent, $$1, col_off; \
		n = split($$2, words, " "); \
		line_length = ncol - indent; \
		for (i = 1; i <= n; i++) { \
			line_length -= length(words[i]) + 1; \
			if (line_length <= 0) { \
				line_length = ncol - indent - length(words[i]) - 1; \
				printf "\n%*s ", -indent, " "; \
			} \
			printf "%s ", words[i]; \
		} \
		printf "\n"; \
	}' \
	| more $(shell test $(shell uname) = Darwin && echo '--no-init --raw-control-chars')
