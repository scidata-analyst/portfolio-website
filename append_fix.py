import pathlib
compiled = pathlib.Path(r'C:\Users\Dell\AppData\Local\Temp\compiled_new.css').read_text(encoding='utf-8')
for target in [r'F:\DASHBOARD_APP\KANCHONWEBDEV.INFO\scss\main.css', r'F:\DASHBOARD_APP\KANCHONWEBDEV.INFO\css\main.css']:
    p = pathlib.Path(target)
    if not p.exists():
        print("missing", target)
        continue
    txt = p.read_text(encoding='utf-8')
    marker = "/* === HOME V2 APPEND === */"
    if marker in txt:
        txt = txt.split(marker)[0]
    txt = txt.rstrip() + "\n\n" + marker + "\n" + compiled + "\n"
    p.write_text(txt, encoding='utf-8')
    print(f"updated {target} len {len(txt)} braces {txt.count('{')}/{txt.count('}')}")
