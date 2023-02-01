#!/usr/bin/env bash

mkdir -p data/

# radkfile
curl -O http://ftp.edrdg.org/pub/Nihongo/radkfile.gz --output-dir data/
gunzip data/radkfile.gz
iconv -f EUC-JP -t UTF-8 <data/radkfile >data/radkfile.utf8
rm data/radkfile

curl -O http://ftp.edrdg.org/pub/Nihongo/kradzip.zip --output-dir data/
unzip data/kradzip.zip -d data/kradzip/
