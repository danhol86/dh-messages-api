package main

import "errors"

type ByteArray struct {
	slice  []uint8
	length int
}

func newByteArray() *ByteArray {
	return &ByteArray{
		slice:  make([]uint8, 91),
		length: 0,
	}
}

func addInfoAndLengthen(a *ByteArray, c []uint8) {
	addValueAndLengthen(a, 48)
	addValueAndLengthen(a, uint8(len(c)))
	for b := 0; b < len(c); b++ {
		addValueAndLengthen(a, c[b])
	}
}

func combineByteArrays(a *ByteArray, c []uint) {
	addValueAndLengthen(a, 6)
	b := a.length
	a.length++
	addValueAndLengthen(a, uint8(40*c[0]+c[1]))
	for d := 2; d < len(c); d++ {
		e := c[d]
		var f []uint8
		if 128 < e {
			f = append(f, uint8(e/128+128))
		}
		f = append(f, uint8(e%128))
		for _, value := range f {
			addValueAndLengthen(a, value)
		}
	}
	a.slice[b] = uint8(a.length - b - 1)
}

func addValueAndLengthen(a *ByteArray, c uint8) {
	a.slice[a.length] = c
	a.length++
}

func keyConverter(a []uint8) ([]uint8, error) {
	v := newByteArray()
	x := newByteArray()
	y := newByteArray()

	combineByteArrays(y, []uint{1, 2, 840, 10045, 2, 1})
	combineByteArrays(y, []uint{1, 2, 840, 10045, 3, 1, 7})
	if y.length > len(y.slice) {
		return nil, errors.New("length of y exceeds slice size")
	}
	addInfoAndLengthen(x, y.slice[:y.length])
	addValueAndLengthen(x, 3)
	addValueAndLengthen(x, uint8(len(a)+1))
	addValueAndLengthen(x, 0)
	for _, value := range a {
		addValueAndLengthen(x, value)
	}
	if x.length > len(x.slice) {
		return nil, errors.New("length of x exceeds slice size")
	}
	addInfoAndLengthen(v, x.slice[:x.length])
	if v.length > len(v.slice) {
		return nil, errors.New("length of v exceeds slice size")
	}
	l := v.slice[:v.length]

	return l, nil
}
