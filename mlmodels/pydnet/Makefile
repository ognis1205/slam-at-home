.PHONY: clean groundtruth help install lint requirements pretrained kitti
.DEFAULT_GOAL := help
ROOT := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
S3_REGION := s3.eu-central-1.amazonaws.com
KITTI := raw_data
KITTI_360_2D := KITTI-360/data_2d_raw
KITTI_360_3D := KITTI-360/data_3d_raw

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
	echo "Downloading pretrained model"
	python ./src/cli/download_google_drive.py 1Zu41tHv89q_F7N5KFigzyUY5vAc8ufQL $(ROOT)/data/checkpoint/pydnet

## Download KITTI-360 dataset
kitti: requirements
	ENTRIES=(\
	2011_09_26_calib.zip  \
	2011_09_26_drive_0001 \
	2011_09_26_drive_0002 \
	2011_09_26_drive_0005 \
	2011_09_26_drive_0009 \
	2011_09_26_drive_0011 \
	2011_09_26_drive_0013 \
	2011_09_26_drive_0014 \
	2011_09_26_drive_0015 \
	2011_09_26_drive_0017 \
	2011_09_26_drive_0018 \
	2011_09_26_drive_0019 \
	2011_09_26_drive_0020 \
	2011_09_26_drive_0022 \
	2011_09_26_drive_0023 \
	2011_09_26_drive_0027 \
	2011_09_26_drive_0028 \
	2011_09_26_drive_0029 \
	2011_09_26_drive_0032 \
	2011_09_26_drive_0035 \
	2011_09_26_drive_0036 \
	2011_09_26_drive_0039 \
	2011_09_26_drive_0046 \
	2011_09_26_drive_0048 \
	2011_09_26_drive_0051 \
	2011_09_26_drive_0052 \
	2011_09_26_drive_0056 \
	2011_09_26_drive_0057 \
	2011_09_26_drive_0059 \
	2011_09_26_drive_0060 \
	2011_09_26_drive_0061 \
	2011_09_26_drive_0064 \
	2011_09_26_drive_0070 \
	2011_09_26_drive_0079 \
	2011_09_26_drive_0084 \
	2011_09_26_drive_0086 \
	2011_09_26_drive_0087 \
	2011_09_26_drive_0091 \
	2011_09_26_drive_0093 \
	2011_09_26_drive_0095 \
	2011_09_26_drive_0096 \
	2011_09_26_drive_0101 \
	2011_09_26_drive_0104 \
	2011_09_26_drive_0106 \
	2011_09_26_drive_0113 \
	2011_09_26_drive_0117 \
	2011_09_26_drive_0119 \
	2011_09_28_calib.zip  \
	2011_09_28_drive_0001 \
	2011_09_28_drive_0002 \
	2011_09_28_drive_0016 \
	2011_09_28_drive_0021 \
	2011_09_28_drive_0034 \
	2011_09_28_drive_0035 \
	2011_09_28_drive_0037 \
	2011_09_28_drive_0038 \
	2011_09_28_drive_0039 \
	2011_09_28_drive_0043 \
	2011_09_28_drive_0045 \
	2011_09_28_drive_0047 \
	2011_09_28_drive_0053 \
	2011_09_28_drive_0054 \
	2011_09_28_drive_0057 \
	2011_09_28_drive_0065 \
	2011_09_28_drive_0066 \
	2011_09_28_drive_0068 \
	2011_09_28_drive_0070 \
	2011_09_28_drive_0071 \
	2011_09_28_drive_0075 \
	2011_09_28_drive_0077 \
	2011_09_28_drive_0078 \
	2011_09_28_drive_0080 \
	2011_09_28_drive_0082 \
	2011_09_28_drive_0086 \
	2011_09_28_drive_0087 \
	2011_09_28_drive_0089 \
	2011_09_28_drive_0090 \
	2011_09_28_drive_0094 \
	2011_09_28_drive_0095 \
	2011_09_28_drive_0096 \
	2011_09_28_drive_0098 \
	2011_09_28_drive_0100 \
	2011_09_28_drive_0102 \
	2011_09_28_drive_0103 \
	2011_09_28_drive_0104 \
	2011_09_28_drive_0106 \
	2011_09_28_drive_0108 \
	2011_09_28_drive_0110 \
	2011_09_28_drive_0113 \
	2011_09_28_drive_0117 \
	2011_09_28_drive_0119 \
	2011_09_28_drive_0121 \
	2011_09_28_drive_0122 \
	2011_09_28_drive_0125 \
	2011_09_28_drive_0126 \
	2011_09_28_drive_0128 \
	2011_09_28_drive_0132 \
	2011_09_28_drive_0134 \
	2011_09_28_drive_0135 \
	2011_09_28_drive_0136 \
	2011_09_28_drive_0138 \
	2011_09_28_drive_0141 \
	2011_09_28_drive_0143 \
	2011_09_28_drive_0145 \
	2011_09_28_drive_0146 \
	2011_09_28_drive_0149 \
	2011_09_28_drive_0153 \
	2011_09_28_drive_0154 \
	2011_09_28_drive_0155 \
	2011_09_28_drive_0156 \
	2011_09_28_drive_0160 \
	2011_09_28_drive_0161 \
	2011_09_28_drive_0162 \
	2011_09_28_drive_0165 \
	2011_09_28_drive_0166 \
	2011_09_28_drive_0167 \
	2011_09_28_drive_0168 \
	2011_09_28_drive_0171 \
	2011_09_28_drive_0174 \
	2011_09_28_drive_0177 \
	2011_09_28_drive_0179 \
	2011_09_28_drive_0183 \
	2011_09_28_drive_0184 \
	2011_09_28_drive_0185 \
	2011_09_28_drive_0186 \
	2011_09_28_drive_0187 \
	2011_09_28_drive_0191 \
	2011_09_28_drive_0192 \
	2011_09_28_drive_0195 \
	2011_09_28_drive_0198 \
	2011_09_28_drive_0199 \
	2011_09_28_drive_0201 \
	2011_09_28_drive_0204 \
	2011_09_28_drive_0205 \
	2011_09_28_drive_0208 \
	2011_09_28_drive_0209 \
	2011_09_28_drive_0214 \
	2011_09_28_drive_0216 \
	2011_09_28_drive_0220 \
	2011_09_28_drive_0222 \
	2011_09_28_drive_0225 \
	2011_09_29_calib.zip  \
	2011_09_29_drive_0004 \
	2011_09_29_drive_0026 \
	2011_09_29_drive_0071 \
	2011_09_29_drive_0108 \
	2011_09_30_calib.zip  \
	2011_09_30_drive_0016 \
	2011_09_30_drive_0018 \
	2011_09_30_drive_0020 \
	2011_09_30_drive_0027 \
	2011_09_30_drive_0028 \
	2011_09_30_drive_0033 \
	2011_09_30_drive_0034 \
	2011_09_30_drive_0072 \
	2011_10_03_calib.zip  \
	2011_10_03_drive_0027 \
	2011_10_03_drive_0034 \
	2011_10_03_drive_0042 \
	2011_10_03_drive_0047 \
	2011_10_03_drive_0058 \
	);\
	for ENTRY in $${ENTRIES[@]}; do\
		if [ $${ENTRY:(-3)} != "zip" ]; then\
			FILE=$${ENTRY}'/'$${ENTRY}'_sync.zip';\
		else\
			FILE=$${ENTRY};\
		fi;\
		echo "Downloading: "$${FILE};\
		python ./src/cli/download_aws_s3.py ${S3_REGION} avg-kitti/${KITTI}/$${FILE} $(ROOT)/data/mount/KITTI/${KITTI}/;\
	done;\

## Download KITTI-360 dataset
kitti360: requirements
	ENTRIES=(\
	2013_05_28_drive_0000_sync \
	2013_05_28_drive_0002_sync \
	2013_05_28_drive_0005_sync \
	2013_05_28_drive_0006_sync \
	2013_05_28_drive_0007_sync \
	2013_05_28_drive_0009_sync \
	2013_05_28_drive_0010_sync \
	);\
	for ENTRY in $${ENTRIES[@]}; do\
		FILE=$${ENTRY}_velodyne.zip;\
		echo "Downloading: "$${FILE};\
		python ./src/cli/download_aws_s3.py ${S3_REGION} avg-projects/${KITTI_360_3D}/$${FILE} $(ROOT)/data/mount/${KITTI_360_3D}/;\
		for CAMERA in 00 01; do\
			FILE=$${ENTRY}_image_$${CAMERA}.zip;\
			echo "Downloading: "$${FILE};\
			python ./src/cli/download_aws_s3.py ${S3_REGION} avg-projects/${KITTI_360_2D}/$${FILE} $(ROOT)/data/mount/${KITTI_360_2D}/;\
		done;\
	done;\
	FILE=data_timestamps_velodyne.zip;\
	echo "Downloading: "$${FILE};\
	python ./src/cli/download_aws_s3.py ${S3_REGION} avg-projects/${KITTI_360_3D}/$${FILE} $(ROOT)/data/mount/${KITTI_360_3D}/

## Generate ground truth depth maps of KITTI-360
groundtruth: install
	python ./src/cli/generate_kitti_ground_truth.py $(ROOT)/data/mount/KITTI-360/data_3d_raw $(ROOT)/data/slices

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
