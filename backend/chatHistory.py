import os
import json
path = "data"

def save(data, id):
    isExist = os.path.exists(path)
    if not isExist:
        os.makedirs(path)
    with open(f'{path}/{id}.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def load():
    # send each file, or read from the files and send the contents..?
    pass