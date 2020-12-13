---
title: Getting to know Ruby operators
date: 2015-07-23
---

The purpose of this post is just to be used as a reference to those new to [Ruby](https://ruby-lang.org/) programming who want an example for each operator. If you’re coming from another programming language, you’ll know most of these but if you’re new to Ruby, save this page as a reference until you become best friends.

I’m sure you know how to use arithmetic operators `+` addition, `-` subtraction, `*` multiplication, `/` division, `%` modulus and `**` exponential power operators already.

## Logical Operators

### `a && b`

The AND operator you’ll be familiar with from other programming languages. If both sides of the operator are true then the method returns true.

```ruby
true && true
#=> true

true && false
#=> false

true && nil
#=> nil

# && can be replaced by 'and' but don't do this.
```

### `a || b`

Similar to the AND operator, OR compares both operands to compare truthiness.

```ruby
true || true
#=> true

true || false
#=> true

false && false
#=> false

# || can be replaced by 'or' but don't do this.
```

### `!(a && b)`

You’ll want to use the bang operator when you want to compare the reverse state of the provided condition.

```ruby
!(true && true)
#=> false

!(true && false)
#=> true

!(false && false)
#=> true

# ! can be replaced by 'not' but don't do this.
```

### `?:` a.k.a Elvis

I don’t often use this operator as it confuses a lot of beginners working on your project. Check out this example to get a simple understanding:

```ruby
a = true

a ? true : false
#=> true
Now let’s mix a bit of previous knowledge with this operator:

a = true
b = false

a && b ? 'Yay! True.' : 'Sorry. False.'
#=> "Sorry, False."

a || b ? 'Yay! True.' : 'Sorry. False.'
#=> "Yay!, True."
```

## Comparison Operators

### `==`

In almost every Ruby class you’ll find this operator. It checks if either side are equal or not.

```ruby
true == true
#=> true

true == false
#=> false

100 == 100
#=> true
```

### `!=`

Friends with `==` is the operator `!=`. Which you might expect from the above examples does the reverse. If both operands are **not** the same then the condition is true.

```ruby
10 != 20
#=> true

def age(dob)
  Age.new(dob)
end

puts age('23-07-2015') != 18 ? 'Have a coke.' : 'Have a beer.'
#=> "Have a coke."
```

### `===`

Similar to ==, === checks for equality. If both operands are not of the exact same then it will be false. The examples below should clear this up.

```ruby
10 === 10
#=> true

10 === '10'
#=> false
```

### `>`, `>=`, `<` and `<=`

As you’ll notice above, I compared the age of someone with a given target value. Let’s get started with a few examples below.

```ruby
10 > 5
#=> true

10 > 20
#=> false

10 >= 10
#=> true

10 >= 5
#=> true

5 < 10
#=> true

10 <= 10
#=> true

10 <= 5
#=> false
```

### `<=>`

This is my favourite. It compares each operand and returns either -1, 0 or 1. I’ve used this so many times when building scoring algorithms.

The best way to describe this is with an example:

```ruby
5 <=> 10
#=> -1

10 <=> 10
#=> 0

15 <=> 10
#=> 1
```

There are a lot more Ruby operators but I’ll post again soon covering `~`, `~=` and `^` later.
