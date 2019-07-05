export function strToDHM(str: string): { d: number, h: number, m: number } {
    let dhm: { d: number, h: number, m: number } = { d: 0, h: 0, m: 0 };
    let r: string[] = str.split(':').reverse();

    let m = parseInt(r[0]);
    let h = parseInt(r[1]) + Math.floor(m / 60);
    let d = parseInt(r[2]) + Math.floor(h / 24);

    dhm.m = m % 60;
    dhm.h = h % 24;
    dhm.d = d;

    return dhm;
}