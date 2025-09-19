
import json

file_path = "/Users/somethinginmy/Desktop/farming mate (09.16)/src/data/db.json"

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for user in data['users']:
    if user['id'] == 'farmer002':
        user['avatarUrl'] = user['profileImageUrl']
        break

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Successfully updated farmer002's avatarUrl in db.json")
