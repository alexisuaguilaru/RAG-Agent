## Garage
This folder contains the config file for Garage service.

### Env Vars
* `GARAGE_DEFAULT_ACCESS_KEY`: Generate a random key with `openssl rand -hex 16`
* `GARAGE_DEFAULT_SECRET_KEY`: Generate a secret key with `openssl rand -hex 32`

### Modify Config File
Based on a TOML file, to add and modify the options use the full configurations options document in [Garage config file](https://garagehq.deuxfleurs.fr/documentation/reference-manual/configuration/)