"""Original SVG illustrations. No third-party assets or tracking requests."""
import json
from pathlib import Path
items=json.loads(Path('lib/movements.json').read_text())
# head, shoulders, hip, knees, feet, elbows, hands: sagittal sketches
poses={
 'stand':[(151,68),(150,102),(156,177),(140,224),(164,271),(111,136),(92,98)],
 'squat':[(148,101),(146,133),(195,190),(131,202),(151,271),(112,149),(97,117)],
 'overhead':[(150,93),(150,126),(178,192),(125,205),(145,271),(125,77),(104,46)],
 'pull':[(153,91),(150,123),(155,191),(173,230),(153,270),(119,79),(106,41)],
 'hinge':[(112,139),(141,159),(197,174),(164,224),(160,270),(122,200),(108,240)],
 'lunge':[(147,74),(149,110),(160,176),(103,218),(99,271),(117,138),(99,113)],
 'push':[(83,195),(112,192),(181,203),(231,218),(268,234),(111,230),(116,266)],
 'inverted':[(150,235),(150,205),(155,139),(165,91),(151,45),(120,229),(119,267)],
 'core':[(89,190),(113,210),(169,245),(222,216),(257,184),(122,165),(139,130)],
 'run':[(143,62),(144,97),(158,166),(117,205),(87,243),(107,118),(119,150)],
 'row':[(148,110),(154,141),(173,209),(230,226),(246,266),(119,163),(90,177)],
}
for m in items:
 n=m['name'];kind='stand'
 if any(x in n for x in ['스쿼트','클린','스러스터','월볼']):kind='squat'
 if any(x in n for x in ['오버헤드','스내치','저크','프레스']):kind='overhead'
 if any(x in n for x in ['데드리프트','스윙']):kind='hinge'
 if '런지' in n or '피스톨' in n:kind='lunge'
 if any(x in n for x in ['풀업','머슬업','토즈']):kind='pull'
 if '푸시업' in n:kind='push'
 if any(x in n for x in ['핸드스탠드','월워크']):kind='inverted'
 if any(x in n for x in ['싯업','할로우']):kind='core'
 if any(x in n for x in ['러닝','셔틀','언더','버피','박스']):kind='run'
 if any(x in n for x in ['로잉','바이크']):kind='row'
 head,sh,hip,knee,foot,elbow,hand=poses[kind]
 def path(points):return ' '.join(('M' if i==0 else 'L')+f'{p[0]} {p[1]}' for i,p in enumerate(points))
 otherK=(knee[0]+38,knee[1]+3);otherF=(foot[0]+40,foot[1])
 if kind=='lunge':otherK=(215,221);otherF=(192,270)
 if kind=='run':otherK=(196,205);otherF=(222,173)
 if 'ピストル' in n or '피스톨' in n:otherK=(222,193);otherF=(270,197)
 arm2=[sh,(300-elbow[0],elbow[1]),(300-hand[0],hand[1])]
 extra=''
 if kind=='pull':extra='<path d="M60 40H245M65 40V280M240 40V280" stroke="#59635d" stroke-width="5" fill="none"/>'
 if '링 머슬업' in n:extra='<path d="M102 5V36M198 5V36" stroke="#7d8982" stroke-width="3"/><circle cx="102" cy="47" r="13" fill="none" stroke="#3ecf8e" stroke-width="5"/><circle cx="198" cy="47" r="13" fill="none" stroke="#3ecf8e" stroke-width="5"/>'
 if any(x in n for x in ['박스','스텝업']):extra+='<path d="M190 217h80v58h-80zM190 217l20-13h80l-20 13M270 217l20-13v58l-20 13" fill="#59635d" stroke="#99a69f" stroke-width="2"/>'
 if '로잉' in n:extra+='<path d="M55 278H275M192 270l-8-33" stroke="#3ecf8e" stroke-width="8"/><circle cx="65" cy="240" r="28" fill="none" stroke="#99a69f" stroke-width="6"/>'
 if '바이크' in n:extra+='<g fill="none" stroke="#99a69f" stroke-width="5"><circle cx="90" cy="245" r="34"/><circle cx="240" cy="245" r="34"/><path d="M90 245l60-65 35 65H90M185 245l35-85h20M135 180h35"/></g>'
 if '스키' in n:extra+='<path d="M70 275V30H230V275M98 55L92 98M202 55l6 43" fill="none" stroke="#7d8982" stroke-width="4"/>'
 if '언더' in n:extra+='<ellipse cx="150" cy="161" rx="108" ry="132" fill="none" stroke="#3ecf8e" stroke-width="3" stroke-dasharray="9 4"/>'
 equipment=''
 if m['category']=='WEIGHTLIFTING' and not any(x in n for x in ['에어','워킹','피스톨']):
  y=hand[1];equipment=f'<path d="M52 {y}H247" stroke="#c7ceca" stroke-width="6"/><g stroke="#3ecf8e" stroke-width="13"><path d="M62 {y-22}v44M78 {y-27}v54M222 {y-27}v54M238 {y-22}v44"/></g>'
 if '덤벨' in n:
  x,y=hand;equipment=f'<path d="M{x-16} {y}h32" stroke="#c7ceca" stroke-width="5"/><path d="M{x-17} {y-11}v22M{x+17} {y-11}v22" stroke="#3ecf8e" stroke-width="10"/>'
 if '케틀벨' in n:
  x,y=hand;equipment=f'<circle cx="{x}" cy="{y+18}" r="17" fill="#3ecf8e"/><circle cx="{x}" cy="{y}" r="10" stroke="#3ecf8e" fill="none" stroke-width="5"/>'
 if '볼' in n:
  x,y=hand;equipment=f'<circle cx="{x}" cy="{y}" r="24" fill="#3ecf8e"/><path d="M{x-21} {y}h42M{x} {y-23}v46" stroke="#246744" stroke-width="2"/>'
 svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 310"><title>{n}</title><ellipse cx="160" cy="283" rx="102" ry="8" fill="#111513"/>{extra}<g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="{path([hip,otherK,otherF])}" stroke="#737b77" stroke-width="17"/><path d="{path(arm2)}" stroke="#737b77" stroke-width="13"/><path d="{path([sh,hip])}" stroke="#d4d4d4" stroke-width="32"/><path d="{path([hip,knee,foot])}" stroke="#3ecf8e" stroke-width="18"/><path d="{path([sh,elbow,hand])}" stroke="#d4d4d4" stroke-width="14"/></g><circle cx="{head[0]}" cy="{head[1]}" r="18" fill="#d4d4d4"/>{equipment}<text x="25" y="302" fill="#858585" font-size="8" font-family="monospace">{m['id'].upper()} / MOVEMENT STUDY</text></svg>'''
 Path('public'+m['image']).write_text(svg)
hero='''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 650"><g opacity=".16" fill="none" stroke="#34463c"><circle cx="250" cy="320" r="210"/><circle cx="250" cy="320" r="170"/><path d="M250 20V630M0 320H500"/></g><text x="20" y="530" fill="#3ecf8e" opacity=".10" font-size="300" font-family="Impact,sans-serif">26</text><ellipse cx="250" cy="600" rx="160" ry="14" fill="#17271f" opacity=".16"/><g stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M250 345L180 465 145 585M250 345l78 120 28 120" stroke="#79877f" stroke-width="47"/><path d="M238 220l12 125" stroke="#5b6d62" stroke-width="85"/><path d="M216 230l-62-65-17-85M270 230l65-65 24-85" stroke="#a5b8ad" stroke-width="27"/><path d="M120 590h50M335 590h50" stroke="#384c41" stroke-width="20"/><path d="M65 80h370" stroke="#344c3e" stroke-width="10"/><path d="M75 40v80M94 29v102M405 29v102M425 40v80" stroke="#3ecf8e" stroke-width="22"/></g><circle cx="245" cy="170" r="33" fill="#a5b8ad"/><path d="M211 165q0-45 36-34 31 2 32 35-34-22-68-1" fill="#384c41"/><path d="M210 235l-14 95 102 5-16-98-34 25z" fill="#3ecf8e"/><path d="M235 270h30" stroke="#344c3e" stroke-width="4"/><text x="242" y="303" font-family="monospace" font-size="13" fill="#344c3e">W.</text></svg>'''
Path('public/hero.svg').write_text(hero)
Path('public/favicon.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#3ecf8e"/><text x="9" y="46" font-family="sans-serif" font-weight="900" font-size="40">W.</text></svg>')
print('Created',len(items),'original movement illustrations and hero')
