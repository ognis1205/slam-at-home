.PHONY: clean groundtruth help install kitti lint pretrained requirements
.DEFAULT_GOAL := help
ROOT := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
S3_REGION := s3.eu-central-1.amazonaws.com
KITTI := raw_data
KITTI_360_2D := KITTI-360/data_2d_raw
KITTI_360_3D := KITTI-360/data_3d_raw

## Install Python Dependencies
requirements:
	@pip install -U pip setuptools wheel
	@pip install -r requirements.txt

## Delete all compiled Python files
clean:
	@find . -type f -name "*.py[co]" -delete
	@find . -type d -name "__pycache__" -delete

## Lint using flake8
lint:
	@flake8 pydnet

## Install PyDNet package
install: requirements
	@pip install .

## Download pretrained PyDNet
pretrained: requirements
	@echo "Downloading pretrained model"
	@python ./bin/download_google_drive.py 1Zu41tHv89q_F7N5KFigzyUY5vAc8ufQL $(ROOT)/data/checkpoint/pydnet
	@echo "Downloaded pretrained model: "$(ROOT)/data/checkpoint/pydnet

## Download KITTI dataset
kitti: requirements
	@echo "Downloading KITTI dataset"
	@while read ENTRY; do\
		if [ $${ENTRY:(-3)} != "zip" ]; then\
			FILE=$${ENTRY}'/'$${ENTRY}'_sync.zip';\
		else\
			FILE=$${ENTRY};\
		fi;\
		echo "Downloading: "$${FILE};\
		python ./bin/download_aws_s3.py ${S3_REGION} avg-kitti/${KITTI}/$${FILE} $(ROOT)/data/mount/KITTI/${KITTI}/;\
	done < ./data/kitti/files.txt
	@echo "Downloaded KITTI: "$(ROOT)/data/mount/KITTI/${KITTI}

## Download KITTI-360 dataset
kitti360: requirements
	@echo "Downloading KITTI-360 dataset"
	@while read ENTRY; do\
		if [ $${ENTRY:(-3)} != "zip" ]; then\
			FILE=$${ENTRY}'/'$${ENTRY}'_sync.zip';\
			FILE=$${ENTRY}_velodyne.zip;\
			echo "Downloading: "$${FILE};\
			python ./bin/download_aws_s3.py ${S3_REGION} avg-projects/${KITTI_360_3D}/$${FILE} $(ROOT)/data/mount/${KITTI_360_3D}/;\
			for CAMERA in 00 01; do\
				FILE=$${ENTRY}_image_$${CAMERA}.zip;\
				echo "Downloading: "$${FILE};\
				python ./bin/download_aws_s3.py ${S3_REGION} avg-projects/${KITTI_360_2D}/$${FILE} $(ROOT)/data/mount/${KITTI_360_2D}/;\
			done;\
		else\
			FILE=$${ENTRY};\
			echo "Downloading: "$${FILE};\
			python ./bin/download_aws_s3.py ${S3_REGION} avg-projects/${KITTI_360_3D}/$${FILE} $(ROOT)/data/mount/${KITTI_360_3D}/;\
		fi;\
	done < ./data/kitti/files_360.txt
	@echo "Downloaded KITTI-360: "$(ROOT)/data/mount/${KITTI_360_2D}
	@echo "Downloaded KITTI-360: "$(ROOT)/data/mount/${KITTI_360_3D}

## Generate ground truth depth maps of KITTI-360
groundtruth: install
	@echo "Generating ground truht of KITTI dataset"
	@pydnet_kitti_ground_truth $(ROOT)/data/mount/KITTI/raw_data $(ROOT)/data/slices
	@echo "Generated ground truth of KITTI: "$(ROOT)/data/slices

## Export PyDnet MLModel.
mlmodel: install pretrained
	@echo "Exporting PyDnet MLModel."
	@pydnet_mlmodel pydnet 384 640 $(ROOT)/data/checkpoint/pydnet/pydnet $(ROOT)/models
	@echo "Exported MLModel: "$(ROOT)/models

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
