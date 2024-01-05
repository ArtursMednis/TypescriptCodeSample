import L from "leaflet";

var emptyBase64 =
  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

//  https://icons8.com/icon/3wt28E09Qzxc/cannon
var cannonIconBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAArCAYAAADhXXHAAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFO0lEQVR4nO3YfWwTdRgH8IfE98RE/jIxBsFoiEG3ld7utsGcIAwhvASMoEQxhLllAjJMRDAhBiIGlWDAl7D1cATcugyi7K7sBYSt1+66rV3v2m6TDeVt4F7s3RDMGDD3mF/X6m1t57be3P7YN3n+ud7Lp7/+fs/dFWAyk/n/w3jbH2dktYKR1Ku0pGyDiRxaVs8wsoqhSpKU1TARQ8vqOi20v5TfyWjDRMqXa36eTktKRzhWRUZSj8NESK7RNo2lrAdMRuH2iqLWqojY8Z4OrKH6KYJkKaGHpQQklZds70mp8zdHBo/DdMhnKqcPRmpr78raX2hZ7Y4CPjniCxZwjrlmTvy1kBNlM+c4XMTXxP/XMXm0dQZrtOayRuFeJKS2Nuy7YI02HRhZWTMibCHn+MrMOzBUhbyj18w5tkfa9zBle3q4SDY0HRKtffPOddTqMh2KT9pnFvJiqZkTW7XoAk7MigXJaurgfNHP1KudkcC0pBbBSIOIUwotjjfNnHg3CO7KXyvOMRmtR01GoXc0SFZTOzZ5XYyk9IVhZaU3Xup6DEYTM+/YWXysFvldMp5Y7eyLFclqKlI7oyVFTavE+0YMtWR4jac2eqoqcnx4emsD8htk3aAsJeChJNvtlDp/S/Dnb2dk5RztUVNHhCx+reGB0mxvXkVOwz2CDNXJt9y6Yk1G6819y5wLX2nBB2E0qXz70kOlG73nCM72SQt2eP7AzoabAeyx+aJ+UEroYhOrkiGWnMqWvycw8bMLeLe7F0nu3LqHhUtqdYRaO/MS7QkxQS3r3QvKc3x9P33QiH+29wSgbdINNOsLvW4yVD0XE7R/VL3lZFS9x1oD0FttPZg/1z68xZJiw/2La/DAAhFNtC0a9LLJUPlMzFAu0/VIxRbfHYK9IvgD2LqDF4ceJVrA7Ru9uPzENUxy/9t+Umv8uDb3En6+ok67mM7n0ZVPxgztx3qTQ6te2N2MTcd/wyNDjOo3adW40nw1yj1eDT364eadTQTayBrsT4BesWR53tC2KW599J6am2zDZT9cHxLKaOpFe8du0DMlGfJSLdbyjicqNnNvy7ChTOBtQPkrUeqKbfVrw2e5n9ViK7Y04HdM+EL5NrUa5ziVkUBx9tlmTODdFtAz5Zt9V7Tg4pXOMOxH2Z6IqFXmq7hrnRu3vefDl4TOf7YTaHyJE+NKnN1JoviwbtjSLHmPFlu2yYeHB7Wh7N3nw6Bza/x4SLMYd7wb/EKSEoCGymDxxd5fte2rfLOvTQs+Om/gLTbz0+Yw7MtnOwbss2e1q/8Jytk+AJvAuRNBz/AZntSKnIbuEPZIavUAyNYPGyNOA9Jvyed5yXZ8Pf9yYBtVfWUA9vkSr/4vhZZMeVX5Ft+NSO3ri+W1URdTelkbpoXmq9uPCaWyBlvXBGOVkgx5xpE5tqJIry4rjl8bsgPQznY0lPsGztdT9e/DWIfcIk2ULTPwzkVZi1lKKNie7d3P1Ct3tO3JKFxEw5mmQaPZX3GcSzLmuu6H8Qoj+1+lJfU2wRpON4YB40PQEmeLkXNNg/FOYv0NiqpurY2MrOuN4+rz43+URvfyNyZBnGIo8ybHWdwfx/EuUwLv/Dqer9/0QmmNPk9Yk5nM6DIFAKYCwAwAmAUAswEgBQDmAUA6ACwCgCUAsFRTS4Lb04P7pQSPmxU8z9TgeXUL+WeEAoDFgyB61WIAMAavows2IThCY4FdFDy/LthQyM/1KACQ5j4zeAEGANIAYD4ALBw0FUJTgGwnn5P9yP7kOHI8OQ8537Cnwd+UhVRRlGuPqQAAAABJRU5ErkJggg==";
export const lCannonIcon = L.icon({
  iconUrl: cannonIconBase64,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

//  https://icons8.com/icon/17916/mortar
var mortarIconBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAC2UlEQVR4nO2WTU8TQRjHR9lVpN1t7csMJsSXixeDYVuitKAkhih6QKJodgm0sCVtERpK292tBlhmIRpjOGBijFw88QWMn0C8GA9+ARNDYvCiSAy+JMWOGUy1FhHasj0Y/slz2Twzv/8z/93JArCr/1m6DvZiFSZ0/VBN5eEA7NWTaM7QEMEaWtB1B19RAzHZ9nwwaCN6CpKfJuBLfbTOURG4ocE7EylIIgGeRAI2MpF0E6yit1NJdMx8uAp1OjEtOn00YCPRAJ8ZU9EJ0+FYhfEc/JcJBa0kw7YrFYCj4UI41tDKtFLbaDrc0FAfVlE2Hz6pwi9YcZ0xHY7Ttdewir7/cewpSDraaj40e6sPmwofGbDfjcn27KQKf0+uQNJx3kL8Amuugam0u/1W3J0J9/BkqM9OJhV67IhcvlBDWhr3fe7tsjwJSdZ7JsFhG1bhNzrxeMJNwj02Qi+drksW4vewX4PXLS8e3D9KRiIOsuNwfNPdjDW4mp/5eAISqXMdnglc5RZCErcOj/TyqzsKn1ZhE9bQp4JPjYgdVgrP+gS2P9c7paEY7Z0ZrTuwI3A95W7AKlwugGfjYeesT2CX/F5msKC/FmtozVBgZ9lwQ4P1WIXvCy8aI420LdY9wxqaLwuup13HDQ2923jLwbGt1pYdQzzqPKfccH7cMLmGZrZlvpwYRsKus+Eefm1A4ogy5MiDw9li9ik5hoFubol+TrSoCXXYSQwVPSQA7Clmn5JjCImWxzkDtIb67a/pP16xg5QUgyxyckji1mTJ+orCB4O2xdl2sB+UqKJjkEU+FhKtqyHRcrJf5E7rrYABZWjbMTQ3VF30Ccyiz8Mu/638HuZNk1DVXgw8JPGnZJHL5KKUJe72ps1+gZn3e1jyzxKYot7oYBBUy5K1MxF1PA0H+ajcbT+yabPPy4z7PeyjVi9wtdSDg/lFn/kEZo72gBKE09BXyrpdAbP1A4cVe5vOxNAIAAAAAElFTkSuQmCC";
export const lMortarIcon = L.icon({
  iconUrl: mortarIconBase64,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

//  https://icons8.com/icon/LZtGgAmh0n0e/bullseye
var targetIconBase64 =
  "data:image/png;base64,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";
export const lTargetIcon = L.icon({
  iconUrl: targetIconBase64,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

//  https://icons8.com/icon/1Y2TAlBbdkBu/binoculars
var binocularIconBase64 =
  "data:image/png;base64,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";
export const lBinocularIcon = L.icon({
  iconUrl: binocularIconBase64,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

//  https://icons8.com/icon/13800/location
var locationIconBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAArCAYAAADhXXHAAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC1UlEQVR4nM3ZPWgUQRgG4FciYjSxiFZBEA0WBrERksvlm90inlhaGAMBtVADWiiKpQTxD8VKMARsAmJlIxaKRiKCCBoEgwbUSgwxKBprxSSv7NzmOCPefbM7e7mBYbmffffZ2bm52VnAc2GIlezB+miLeirsRQMF3TS4RMFLCr7QYIEGtNvodfS+wUX7vV401B7ZjlUUDFAwFcN0VTDFACeZQ2NtoAZ9FMw4Ic0/9TMF+7JDhlhNg+spkVxSb3En1viFdmAdBeOeoYzrC+bR7AeaQyMNnmYEZdyXn0RXLh0UWEGDu5lCTaneSYc1OJKwpeYS7deNg8mgeTTT4KvyQPP2xyLYtdj/GO0foEDB7fhzzUnOMESTO1ZwSgmdpkFHlaxOO1zpwCeSYN8pgr8xjzZVXh5tFHxXZL51gwbYqmzVPsfcfmXuZn2o4IAi8H00WiQYXT5UzQ7Qrw+NJibVsVddoIuFgmuKrnAB2kLBsAJ7WB1YVig4qsgegldswjGRBocULTvsgj2vOPuzibCCQUX2Ob9nb/AsIfa516umHLoWGKDLEdpZdidRqRtscWsBg08K8AQLWKvKC9FEwRsF9KMTNMZeUWCj8DHm0FIxK4cWOw3U5V12x4bYrgov1mk7JC2ZRLM4aR9QzwuKXWubM9YeTDDqAI5a5ScNXtPgcbz95bj/w0RQizXY7XSwtDVAITE2bt1HNYEKxlJBY2w7Bb8zhs5RsCM11mGukKYOeYGWhh6D2YygPxhigzesBQuOZ9QFjnmFlibOgvueoaOuE3g9OI9W1X2UUV/+jZlAS2DBXi/YAPszhZaBR1Je/pGaQMtWFF8lxE54XzmsCu7CJrtu4AaddZ6regMLehzWteYp2LMs0BLY4Iyyn55GPRQKblTB3kSdPbW59x/og/p7zFS8x/p7KV8wnmgJsxbFPqwzmIyxk9Hr5TZVLPYvObqtyaPVd/gfZ2UPDWKK7pAAAAAASUVORK5CYII=";
export const lLocationIcon = L.icon({
  iconUrl: locationIconBase64,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

//  https://icons8.com/icon/9A9UJY1V3Zw9/flag
var flagIconBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAArCAYAAADhXXHAAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD60lEQVR4nO2YX2gcRRzHp1SloihaCIggKAhiiiJYSkF8EYWqoYqclXK7a5pk/lx66WUmXEpjuQdDfTC0ElAJxAf/PbQxgYu7iTEtlRYiom3EeMYaI2ip1pjGgjS5m929n+zm9nrnJfW6d6f7cB+Yl5th53NffvPbuUOoTp06ZQOdLXdCInQTqgbHQp03A0IbijaI4bskp+1S0PclZ5Orgw6bnB6WgnaYnDzprLnWc2UMPyo5HZWc2pLT39KCPFiRqK7gNwwF27qK5/Rmdh8kEjeYgvZKzlZMweDfhuR00eT0jBQsaQo24AzJ2YjJ6U8l6zkd9C2aDLfea6gE8kMjA1LQ8XIkfQ3OfvAtOxGmDbpKsp7spEYu1kxUMJCCZUHQBt/CuopTV9PFdprXTtZcTfc537KGSvoLS2FxXxWEDnaBGd+7zjx93X+yCtlZKDvPaMa3ZHcUsqlvwCW9AtZ7g2slO+VbdhLj2w2VWJ7sl23r1631zluQvbQIsLwM9uRYybw9chQuX7oM8d3dMDQwBJBOu1+guG5pGhLaJt/ChoK/8GSPa3hhTdlXOEAmA8l3k9Df0w+mNMEafLNY9sQnMDs9C0/f/wyIXV1uwGYiXnrQeOQx37K6gg/lS0FxDhktTbWv191ce1xzZc7Pnwf74+HiNYcPAVgWpM6kYGlhCbLnvluvK3T7lh3T8BOFdbvQQe2STeJRyP6xAHMzczD16ZQrZfW9mp+/EqPw+14M1pHXwP5sEuzkEJj7O9aW5XTUt+xJTdtkqHjZkz3H6Np129sD9tQpyE5/BdbbR9zPure/AC81Nrlp79v6fHn9ltPFf77erwtdxSc82c9b8Vy5HeD4LhV2b2mClx/eCTPNe8ruHGmOH/Ata6j4gCc7oeELFfdace2REazFf7JhvK3wkK3U+E0mOU34lj0WCm00FPKnJ3wxSpZqJiroX5lYpBFVgqHgpCf7LSYzNUr0ghRsK6oUXcMdnuzpZnL2ahJMSsE+MAVrci7cEAptdE4zCNogRWSbJaji3oEF+8gUbFZyapaIcva95PQgRCK3omowrrY2erLjKv4lt0kqI+iW63kOYHwjdJK7M5w+kuliD0E0eltVBIs2QWiDrpJfHVnnnnslRr+G/ewOFFR0lXzopXtSoc+iIDOm0D35FhYmcRRkRhV8T0G/PYqCjq6QH3Oy8yjoGAoZ8A7ZiNK+GQUZXSUveqUwpuKnUJAZUdo3O/eD3C/eAyjoGAqZzqU7jIKOrpK+nOzPKOgYatuO/P02XMG/KP8FE+HwLYZKMqvCbTtQ0NFVctptYQrpQUFHD5MWJ12nlf3fLnXq1EHV4W++cfT4438wtAAAAABJRU5ErkJggg==";
export const lFlagIcon = L.icon({
  iconUrl: flagIconBase64,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

//  https://icons8.com/icon/80662/bang
var bangIcon =
  "data:image/png;base64,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";

export const lBangIcon = L.icon({
  iconUrl: bangIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

//  https://icons8.com/icon/0cqSx02yzjve/bang   ar šo problēma
//  https://icons8.com/icon/ENo7ef4qY4ZT/bang
var explosionIcon =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAE9UlEQVR4nMVXTUxcVRR+Rmv8WxiNujPxZ9NVF8SEGOPkvfvz3gA2RcME6rCBGShtpAvaGEqTgvQP0lJKS7G1BQpdGE3VmFQbF2KwM/e+B1FssTTAlLaBKkX+YWaYv2vO0JnCzDAwFduTnMXcd+ee737nnO+8J0n/wZwIfSw9LuvUtFecCE13mEwvrOvBTFFyDYTeXG2fE6FPGEJi3VlwYKwyhLw6pRXdaWkbVtpnaFrvNYtF6JR2riuA7rS0DZyQWcNs9uuUuhyy/G7sHqfJ9DYnZGH64EHBCPEzRXkt2ZnO9PRnGcYfOhHS1gRCp7TdVVwcHC4rC3FV9TgJ+VJH6OXIc47xZ31Wq8dz7Ji4ZrHMMUJKY8/oMJmecSrKB7qqfs0w9jKMxzpMphfXnIburKw5CDB7+LC4vnWrh1M65ZDlvDAASkdG9+wR8Pyv3buFrqp/Rm+K0EeMkG85xp7fNm+egotwjANOjC1SqmmYqKoKBwEfLS8XXRkZHp3SP3RN87jr6sLr80eOCEiHTsilSNBb27cHpw8cCD8ftNl8nNJfpFRNhzQUFQUjACLBXDabb9Bu9y9dv1lSEri1Y0coEjTicAFOiIcT8kbKABxL0hDn92+/mvdkZ89zQsqlh7HuBGlI6Mfve8z67dLSkE7pYLJWTmpf5eQ86STkJ1dxcSB6cEN8IP/Pp4W3sX7Z2syhQ6APXo5xesqBHQi9wyltZJROdWVmzt3ZuTNaB95T9SLY1yy85xoWf7c2CDHWFgegNy/Pwwj5bs1Br8jyWwyhSp3SYV1VPQOFhb7xffsSUh5ytQhxr034Ln8uggMtQky0LwMwW1srrlutXjhHJ2TcIOQCtKCT0pdW1nRFCXJCQiNlZSLSXit5wHEmHHSpAzOJ9sIlhkpKgj3Z2TMMoQDoBce4GtQVUhwFwTDeqFN6EfoZ+na2pmZFAL6LjXEAgJHg1XPCd6lJeE8fT/i/udpa0ATBMBYwxBhCAxzjzGVswBTUVfU8x9jbX1DgBxWMK7rOeAbCPtomAvwL4W1ueKAbR4+KexUVor+gwGNoGojYGCekGSQ6aXewJYzc3LYt2gUL7SeFGI8JPN4ufD82Cc+JJWmoqxN9+fk+hrHfUNV+hlAVl+VNUqqmU9o9VFKyqHoN9SI01CpCf7eJYH+LCN0+HwYQvNGSkHKX3e7XVfWHlINGDMZnl6a5QX7Dh56oF96mB/n1fX8qDMB3uSlxzmtqQIZhCm6UUrXenJynOSHDMOlWKkZvU70Q/7StWHThQWS3+w1Kv0kZAMP4U9DxiOZDa8L47bNa3QOFhdFB5L9yJmnLQjdBHaXEgoOQVzkhbujhyepquEXA0DQ3p/Quw/isYTbPR4OcXCw8V1GRH3I+UVkZz4LN5jNUde0sMEpbuzIyQDzc8CZjqOoFhvF7QpKe6DCZnuIYu6f274/N9QLHuJUTMmmYzbMQNAImJRa4LG8Ktw6ljMtyfndW1nOxewxNu3yntDQKAJROpzRc7aBuXFFkHeOz8AYFbAEzvbm5gTWxwGVZ+RXj15PtcSpKca/FMhepDegUhyy/H7svFgzI/UN1RKzB2w0nxAfB7+7aBWP3hrSKRcAwWc6Q1sN0SkfG9u4Vv2/ZMgepkh61cUKarubkBDmlk6AZjxyAA6EsmGg6IZXS47AeQp5nijKz2hfR/2rr9VH6Ly2FDIPh6OBOAAAAAElFTkSuQmCC";

export const lExplosionIcon = L.icon({
  iconUrl: explosionIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

//  https://icons8.com/icon/68605/bang
var blueExplosionIcon =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAEoklEQVR4nO2Wa2yTZRiGy8lAxIk/UDCihCGHMVgPrgfHNsY2GOsOofED7Le1c4cGYQRBDQN/lKpZmGwEZH86E2lFh45s69oBo1W6dkRGA0EH/tBhHJIQIKBTYzznMu/GZAhFNhGi8U7uPPf7Psc8+fLmUyj+x78Vj61lwpRyvpy2kgfvygDTV7EudiW/xD7Lxn+kwWwbp+NsVGhsjLnOaWdkXBmfzSpjVZyNHoXEqNs+gKoYj6qEi6oSPlEVk3KNr4QsZQnHhVYWc0RVQm60OvOKUalLsQ15AL0VWW/Fo7ewVFfEGZ0V1/xnmCh8Ois+QxHFfXEWLPoi9g/ONRSi0lmp1Fnp1lv5WVfE0SEPoJWJSS6kV9hUifHJBVSnFHIhRWZTSgEX9RLjRFyqlbF99wXkphRSmVxIt2CftqAVer5MumI4yJTxLHoaeeC8cAXzMsyEM804xHndYQqEzTDzcoaZ7gyZyvQVqAblr8qUaVMMF8ZlyMYVeISu6OC5jWHiBnx2GLmxgwsVYWYMznkpxBRhJYnxxuWcy1mGetgD5OVxn0nia0nifkcHkiPEb44Qb70aYrIjjM4Rhs0hdohYR5gkRwjf5jCF4mx6CrtJ4m3F34EsE7PcxLFlS5GdxxhTFeRcVTtUtfPdlnY6hd4S5JstQQ716XZONjQwSpKYuNzEJbOJaUNvmkWMNQ/Zmo/HkkevsNZ8lMK3/RCv7AhCNG4PkiPiLPmUWvL5vq9GPpuKclko6t60cWk2yjIjHlsOvcKWGpHXDEpyBpnlfJ/XnR9AFHYMrmfL4VGbEcmWQ7Uth7DNyLc2I6fKjLwpel03wJosVOVLOF6eTddqI3kKBSPE/e4DTHb5CbgDcFP6+cEVoN0dYLPbT+quIGOvVmdEeTam1Us4L3qIXlE38cJiMtYvIvL8IrrWZyGJ5IYG7tnrR2o4SKDhIPwFu99rY8M7rTwQrd4tfAmMqMggryKD44Ib0vsn9u5jifcARGUbZrudkX/OF/oWG1+LrZnca0/jomMB6cEgo/2tnPLvg6hspUbk2dOw2dM4Z08jj+E0HkBlMtWVKewWOtzKmrAPwj6+CHtxhb38eOX8B0M+fjq8n9jXUplUmcLlqid5WDFc1CSRUJ3E+a2G/h+OiJfcI81MHfBHWvgw4oWjLQSPejFEvDREvPwq7JX8bTVJ/RsZMuypjN5p4Fitof9VuxG6mtnW5YGTzSwYuDvRzNSPm6k50cKc2kQm7TRweedwtlCn5UWnlpNv6Mh26ljrTKTWqaWtTsvpOi2XavSM625C+rSRoIh36lE7EzHv0F772NQlsk1wyAO4NPS4NZx2aWhzaah1qVnr1pDtTmSGW03E/QSpZxt55OxeFuzWEiPiXWr8bg29LjWeXWpkcb8rkUkuNZeEVdwu1CupqVde/Q/co6ROUGjR9N0E5PoEPPUJ9F6xH+1RDmML0dA0B1PTXFqFbowns2kuPfunX//Oi7vGeOTGeDxNc/lccbvQEs9DrbP5qjmBCb44enxzWKy40wjMpNs/i0OBmf2rv+MITcfd/jhnOm+w+juCzqkkdMaiuSvNFf81/A6rmnPYeoRiDQAAAABJRU5ErkJggg==";

export const lBlueExplosionIcon = L.icon({
  iconUrl: blueExplosionIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

//  https://icons8.com/icon/vfsMoLDbFcCC/ding-dong
var dingDongIcon =
  "data:image/png;base64,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";

export const lDingDongIcon = L.icon({
  iconUrl: dingDongIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});


export const gitDownloadIcon = 
  "data:image/png;base64,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";