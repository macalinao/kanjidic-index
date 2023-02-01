#!/usr/bin/env bash

mkdir -p data/

# radkfile
curl -O http://ftp.edrdg.org/pub/Nihongo/kradzip.zip --output-dir data/
unzip data/kradzip.zip -d data/kradzip/

curl -O https://raw.githubusercontent.com/jmettraux/kensaku/master/data/kradfile-u --output-dir data/
