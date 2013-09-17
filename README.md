brainfuck-js
============

A javascript program that allows higher level control and a meta syntax to write
brainfuck programs. Some constructs working, 

Not entirely sure where I was going with, the code is also an amazing example of
this, it was temporary fun, and now the rest of the world can gawk at my crazy
ridiculous code.

It would be fun to write more complicated programs in the meta lenguage, to see
how well my code works.

Could stand to have 100's of tests written - be my guest.

After seeing what I could do in this, my crazy brain thing said, lets do crazier
things.

I was pondering a BF environement that had port mapped functions, you'd set
addr 0 to a port and then '.' would output to that port number ',' would read
from it

I had this crazier idea of writing a BF environment that allowed you a graphics
engine with sprite controls.

32 sprites
64 ports for sprites
        
           ╔══════( 0 )═════╦(1)╦(2)╦═══════( 3 )═════════╗
        0  ║ picture number ║ X ║ Y ║ Transparency(0-255) ║
        2  ║ picture number ║ X ║ Y ║ Transparency(0-255) ║ 
        3  ║ picture number ║ X ║ Y ║ Transparency(0-255) ║ 
        4  ║ picture number ║ X ║ Y ║ Transparency(0-255) ║ 


1 port for user input, 0 if no input available, standard scancode if available,
key down 


Maybe someday...
