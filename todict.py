import json

# Abre el archivo JSON
with open('filtered_data.json', 'r') as file:
    data = json.load(file)

# Crea un diccionario vacío para almacenar los elementos con la nueva llave
new_data = {}

# Recorre cada elemento de la lista
for item in data:
    # Obtiene el valor de la llave "city"
    city = item['city']
    # Crea un nuevo elemento con la llave "city" como nueva llave
    new_data[city] = item

# Crea un nuevo archivo JSON con los elementos con la nueva llave
with open('new_data.json', 'w') as file:
    json.dump(new_data, file)
