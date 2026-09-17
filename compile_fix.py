import pathlib, sass
p = pathlib.Path(r'F:\DASHBOARD_APP\KANCHONWEBDEV.INFO\scss\pages\_index.scss')
t = p.read_text(encoding='utf-8')
idx = t.find('// HOME V2')
snippet = t[idx:]
compiled = sass.compile(string=snippet, output_style='expanded')
out = pathlib.Path(r'C:\Users\Dell\AppData\Local\Temp\compiled_new.css')
out.write_text(compiled, encoding='utf-8')
print("compiled", len(compiled), "to", out)
# also show tail for verification
print(compiled[-1500:])
