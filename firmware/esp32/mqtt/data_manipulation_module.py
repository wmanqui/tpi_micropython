import json

#Función que me permite convertir la trama recibida en JSON
def frame_to_json(frame_str):
    #Elimina saltos de linea y espacios extra
    frame = frame_str.strip()
    
    #Verifica caracter de inicio 
    if not frame.startswith("$"):
        print("[json] Error: trama sin $")
        return None
    #Quita el $
    frame = frame[1:]
    
    
    #Separa campos
    parts = frame.split(";")
    #Cheque que la trama tenga 7 partes
    if len(parts) != 7:
        print("[JSON] Error: trama no tiene 7 elementos")
        return None
    try:
        frame_id 			= int(parts[0])
        caldera 			= int(parts[1])
        humidificador		= int(parts[2])
        ventilador			= int(parts[3])
        deshumidificador	= int(parts[4])
        temperatura			= float(parts[5])
        humedad				= float(parts[6])
        
    except ValueError:
        print("[JSON] Error: valores no validos")
        return None

    data = {
        "frame_id": frame_id,
        "caldera": caldera,
        "humidificador": humidificador,
        "ventilador": ventilador,
        "deshumidificador": deshumidificador,
        "temperatura": temperatura,
        "humedad": humedad
    }

    return json.dumps(data)