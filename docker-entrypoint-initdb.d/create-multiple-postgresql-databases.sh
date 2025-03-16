#!/bin/bash

set -e
set -u

function create_database() {
	local database=$1
	echo "Attempting to create database '$database'"
	
	# Проверяем, существует ли база данных
	if psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d postgres -lqt | cut -d \| -f 1 | grep -qw "$database"; then
		echo "Database '$database' already exists"
	else
		echo "Creating database '$database'"
		psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d postgres <<-EOSQL
		    CREATE DATABASE $database;
		    GRANT ALL PRIVILEGES ON DATABASE $database TO $POSTGRES_USER;
EOSQL
		echo "Database '$database' created successfully"
	fi
}

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
	echo "Multiple database creation requested: $POSTGRES_MULTIPLE_DATABASES"
	for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
		create_database $db
	done
	echo "Multiple databases creation process completed"
fi

# Проверяем созданные базы данных
echo "Listing all databases:"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d postgres -l 