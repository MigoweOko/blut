export function strToDHMS(str: string): { d: number, h: number, m: number, s: number } {
    let dhms: { d: number, h: number, m: number, s: number } = { d: 0, h: 0, m: 0, s: 0 };

    if (/\d+(?=s|m|h|d)/gi.test(str)) {
        let strs: string[] = str.match(/\d+(s|m|h|d)/gi);
        strs.forEach((s) => {
            let num: number = parseInt(s.match(/\d+/gi).join(''))
            let op: string = s.match(/[A-Z]/gi).join('');
            switch (op) {
                case 's':
                    dhms.s += num;
                    break;
                case 'm':
                    dhms.m += num;
                    break;
                case 'h':
                    dhms.h += num;
                    break;
                case 'd':
                    dhms.d += num;
                    break;

                default:
                    break;
            }
        })
    }

    return dhms;
}