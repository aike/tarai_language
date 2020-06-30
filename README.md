# Tarai Language

Tarai language is a DSL(Domain Specific Language) for tarai function music written in JavaScript.

## Tarai Function Music

Tarai Function Music is an approach of algorithmic composition based on [tarai function](http://en.wikipedia.org/wiki/Tak_%28function%29). It automatically generates a complex and very long music from a simple formula.

## Tarai function

Tarai function is a recursive function devised by Ikuo Takeuchi in 1978. This function processes so many recursion function calls. So it is often used as a programming language benchmarking.

![formula](tarai.png)

## Why DSL?

JavaScript does not support 'sleep' command. So it is not suitable for playing sound synchronously with recursive function call.

## Tarai Language

Tarai Language is a minimum programming language for Tarai Function Music written in JavaScript.
It supports recursive function call and syncronous sound play.  
The following table is the Tarai Language specification:

| keyword | description |
----|----
| __sleep__ p1 | sleep until p1 milliseconds  |
| __print__ id p1 <br> __print__ id "string" | output value/string to #id element |
| __play__ p1 p2 p3 | play sound |
| __call__ fname p1 p2 p3 | function call with 3 arguments |
| __def__ fname ... __defend__ | define function |
| __return__ p1 | assign return value in function |
| __v1__, __v2__, __v3__ | local variables in function |
| __a1__, __a2__, __a3__ | local arguments in function |
| __ret__ | refer return value of last function call |
| v1 __=__ p1 <br> v1 __=__ p1 (operator) p2 | variable assignment <br> operater: + - * / |
| __if__ p1 (relational operator) p2 | conditional statement <br> rerational operator: == != <= >= < > |
| __end__ | terminate program |
| __#__ | comment |

## Example Program

```
  #----------------------
  # arithmetic operation 
  #----------------------
  v1 = 5
  v2 = 10
  v3 = v1 + v2
  print elem v3
  end
```

```
  #----------------------
  # sleep example        
  #----------------------
  print elem "hello"
  sleep 1000
  print elem "world"
  sleep 1000
  print elem "tarai"
  sleep 1000
  print elem "language"
  end
```

```
  #----------------------
  # tarai function script
  #----------------------
  call tarai 10 5 0
  end

  def tarai
      play a1 a2 a3
      if a1 <= a2
          return a2
      v1 = a1 - 1
      call tarai v1 a2 a3
      v2 = ret
      v1 = a2 - 1
      call tarai v1 a3 a1
      v3 = ret
      v1 = a3 - 1
      call tarai v1 a1 a2
      v4 = ret
      call tarai v2 v3 v4
      return ret
  defend
```

## Website
http://aikelab.net/tarai/

## Credit
Tarai language program is licensed under MIT License.  
Copyright 2013-2017, aike (@aike1000)