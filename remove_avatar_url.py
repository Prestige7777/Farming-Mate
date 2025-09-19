
import json

file_path = "/Users/somethinginmy/Desktop/farming mate (09.16)/src/data/db.json"

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for user in data['users']:
    if 'avatarUrl' in user:
        del user['avatarUrl']

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Successfully removed avatarUrl from all user objects in db.json")
