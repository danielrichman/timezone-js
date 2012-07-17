import os
import os.path
import json

fake_fs = {}

for filename in os.listdir("lib/tz"):
    filepath = os.path.join("lib/tz", filename)
    with open(filepath) as zf:
        fake_fs[filepath] = unicode(zf.read(), 'utf8')

with open("lib/tz_data.js", "w") as o:
    o.write("var fake_filesystem = ")
    json.dump(fake_fs, o)
    o.write(";")
