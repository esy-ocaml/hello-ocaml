#
# Configuration
#

# List of ocamlfind libraries used in a project
DEPENDENCIES = lambda-term lwt

# ocamlbuild tags (same syntax as in _tags file)
define OCB_TAGS
	true:bin_annot \
	${DEPENDENCIES:%=true:package(%)} \
	<node_modules>:-traverse
endef

# ocamlbuild flags
define OCB_FLAGS
	-no-links \
	-use-ocamlfind \
	${OCB_TAGS:%=-tag-line "%"} \
	-I lib -I bin
endef

define OCB_LIB_FLAGS
	-build-dir $$cur__target_dir
endef

define OCB_BIN_FLAGS
	-build-dir $$cur__install
endef

#
# Shortcuts
#

all: build

#
# Build targets
#

build: native byte lib

lib: libhello.cma libhello.cmxa libhello.cmxs
native: hello.native
byte: hello.byte

%.cma %.cmxa %.cmxs:
	@ocamlbuild ${OCB_FLAGS} ${OCB_LIB_FLAGS} $(@)

%.native %.byte:
	@ocamlbuild ${OCB_FLAGS} ${OCB_BIN_FLAGS} $(@)

#
# Installation
#

install: install-lib

install-lib: lib
	@ocamlfind install $$cur__name lib/META $$cur__target_dir/lib/libhello.*

#
# Utilities
#

clean:
	@ocamlbuild -clean

.DEFAULT: all
.PHONY: all build install clean lib native byte install-lib
