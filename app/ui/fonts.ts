import { Montserrat, Open_Sans, Roboto_Mono, Anonymous_Pro } from 'next/font/google';
 
export const montserrat = Montserrat({ 
    weight: ["400","700"],
    subsets: ['latin'] 
});

export const open_sans = Open_Sans({
    subsets: ['latin'] 
});

export const roboto_mono = Roboto_Mono({
    subsets: ['latin'] 
});

export const anonymous_pro = Anonymous_Pro({
    subsets: ['latin'],
    weight: '400',
});