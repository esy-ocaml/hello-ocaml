all: build

build: build-lib build-bin

build-lib:
	@jbuilder build lib

build-bin:
	@jbuilder build bin/hello.exe

clean:
	@jbuilder clean
	@rm -rf _esybuild _esyinstall _release node_modules

.DEFAULT: all
