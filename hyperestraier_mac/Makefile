# Makefile for Hyper Estraier



#================================================================
# Setting Variables
#================================================================


# Generic settings
SHELL = /bin/sh

# Packaging
PACKAGE = hyperestraier
VERSION = 1.4.13
PACKAGEDIR = $(PACKAGE)-$(VERSION)
PACKAGETGZ = $(PACKAGE)-$(VERSION).tar.gz
LIBVER = 8
LIBREV = 38
PROTVER = 1.0

# Targets
MYHEADS = estraier.h estmtdb.h estnode.h
MYLIBOBJS = estraier.o estmtdb.o estnode.o md5.o
MYLIBS = libestraier.a libestraier.so.$(LIBVER).$(LIBREV).0 \
  libestraier.so.$(LIBVER) libestraier.so
MYBINS = estcmd estmttest estmaster estbutler estcall estwaver estload
MYCGIS = estseek.cgi estfraud.cgi estproxy.cgi estscout.cgi estsupt.cgi
MYSCRIPTS = estconfig estwolefind
MYCONFS = estseek.conf estseek.tmpl estseek.top estseek.help \
  estfraud.conf estproxy.conf estscout.conf estsupt.conf \
  estresult.dtd estraier.idl locale filter increm
MYDOCS = COPYING ChangeLog THANKS doc
MYMAN1S = estconfig.1 estcmd.1 estmaster.1 estwaver.1 estcall.1
MYMAN3S = estraier.3 estnode.3
MYPCS = hyperestraier.pc
MYMACLIBS = libestraier.a libestraier.$(LIBVER).$(LIBREV).0.dylib \
  libestraier.$(LIBVER).dylib libestraier.dylib
MYHPUXLIBS = libestraier.a libestraier.sl
MYWINLIBS = libestraier.a libestraier.dll.a
MYCORELIBS = libestcore.a
MYFCGIS = estseek.fcgi estfraud.fcgi estproxy.fcgi estscout.fcgi estsupt.fcgi

# Install destinations
prefix = /usr/local
exec_prefix = ${prefix}
MYHEADDIR = ${prefix}/include
MYLIBDIR = ${exec_prefix}/lib
MYBINDIR = ${exec_prefix}/bin
MYLIBEXECDIR = ${exec_prefix}/libexec
MYDATADIR = ${prefix}/share/$(PACKAGE)
MYMAN1DIR = ${prefix}/share/man/man1
MYMAN3DIR = ${prefix}/share/man/man3
MYPCDIR = ${exec_prefix}/lib/pkgconfig
DESTDIR =

# Building binaries
CC = gcc
CPPFLAGS =  -I. -I$(MYHEADDIR) \
  -I$(HOME)/include -I/usr/local/include -I/usr/include/qdbm  \
  -D_XOPEN_SOURCE_EXTENDED=1 -D_GNU_SOURCE=1 -D__EXTENSIONS__=1 -D_HPUX_SOURCE=1 \
  -DPIC=1 -D_THREAD_SAFE=1 -D_REENTRANT=1 -DNDEBUG
CFLAGS = -Wall -fPIC -fsigned-char -O3 -fomit-frame-pointer -fforce-addr
LDFLAGS =  -L. -L$(MYLIBDIR) -L$(HOME)/lib -L/usr/local/lib 
LIBS = -lqdbm -lz -liconv -lm -lc 
MTLIBS = -lpthread 
SKLIBS = -lresolv 
APPLIBS = 
LDENV = LD_RUN_PATH=/lib:/usr/lib:$(MYLIBDIR):$(HOME)/lib:/usr/local/lib::.
RUNENV = LD_LIBRARY_PATH=.:/lib:/usr/lib:$(MYLIBDIR):$(HOME)/lib:/usr/local/lib:
MYPOSTCMD = true



#================================================================
# Suffix rules
#================================================================


.SUFFIXES :
.SUFFIXES : .c .o

.c.o :
	$(CC) -c $(CPPFLAGS) $(CFLAGS) $<



#================================================================
# Actions
#================================================================


all : $(MYLIBS) $(MYBINS) $(MYCGIS)
	@$(MYPOSTCMD)
	@printf '\n'
	@printf '#================================================================\n'
	@printf '# Ready to install.\n'
	@printf '#================================================================\n'


clean :
	rm -rf $(MYLIBS) $(MYBINS) $(MYCGIS) $(MYCORELIBS) $(MYFCGIS) \
	  *.exe *.o a.out *.dll.a *.dll *.dylib *.sl \
	  check.out gmon.out leak.log casket casket-* *~


version :
	vernum=`expr $(LIBVER)00 + $(LIBREV)` ; \
	  sed -e 's/_EST_VERSION.*/_EST_VERSION   "$(VERSION)"/' \
	    -e "s/_EST_LIBVER.*/_EST_LIBVER    $$vernum/" \
	    -e 's/_EST_PROTVER.*/_EST_PROTVER   "$(PROTVER)"/' estraier.h > estraier.h~
	[ -f estraier.h~ ] && mv -f estraier.h~ estraier.h


install :
	mkdir -p $(DESTDIR)$(MYHEADDIR)
	cp -Rf $(MYHEADS) $(DESTDIR)$(MYHEADDIR)
	mkdir -p $(DESTDIR)$(MYLIBDIR)
	cp -Rf $(MYLIBS) $(DESTDIR)$(MYLIBDIR)
	mkdir -p $(DESTDIR)$(MYBINDIR)
	cp -Rf $(MYBINS) $(MYSCRIPTS) $(DESTDIR)$(MYBINDIR)
	mkdir -p $(DESTDIR)$(MYLIBEXECDIR)
	cp -Rf $(MYCGIS) $(DESTDIR)$(MYLIBEXECDIR)
	mkdir -p $(DESTDIR)$(MYDATADIR)
	cp -Rf $(MYCONFS) $(MYDOCS) $(DESTDIR)$(MYDATADIR)
	mkdir -p $(DESTDIR)$(MYMAN1DIR)
	cd man && cp -Rf $(MYMAN1S) $(DESTDIR)$(MYMAN1DIR)
	mkdir -p $(DESTDIR)$(MYMAN3DIR)
	cd man && cp -Rf $(MYMAN3S) $(DESTDIR)$(MYMAN3DIR)
	mkdir -p $(DESTDIR)$(MYPCDIR)
	cp -Rf $(MYPCS) $(DESTDIR)$(MYPCDIR)
	@printf '\n'
	@printf '#================================================================\n'
	@printf '# Thanks for using Hyper Estraier.\n'
	@printf '#================================================================\n'


install-strip :
	make DESTDIR=$(DESTDIR) install
	cd $(DESTDIR)$(MYBINDIR) && strip $(MYBINS)
	cd $(DESTDIR)$(MYLIBEXECDIR) && strip $(MYCGIS)


uninstall :
	cd $(DESTDIR)$(MYHEADDIR) && rm -f $(MYHEADS)
	cd $(DESTDIR)$(MYLIBDIR) && rm -f $(MYLIBS)
	cd $(DESTDIR)$(MYBINDIR) && rm -f $(MYBINS) $(MYSCRIPTS)
	cd $(DESTDIR)$(MYMAN1DIR) && rm -f $(MYMAN1S)
	cd $(DESTDIR)$(MYMAN3DIR) && rm -f $(MYMAN3S)
	cd $(DESTDIR)$(MYLIBEXECDIR) && rm -f $(MYCGIS)
	rm -rf $(DESTDIR)$(MYDATADIR)
	cd $(DESTDIR)$(MYPCDIR) && rm -f $(MYPCS)


dist :
	make version
	make distclean
	( cd javanative && ./configure && make dist )
	( cd javapure && ./configure && make dist )
	( cd rubynative && ./configure && make dist )
	( cd rubypure && ./configure && make dist )
	( cd perlnative && ./configure && make dist )
	cd .. && tar cvf - $(PACKAGEDIR) | gzip -c > $(PACKAGETGZ)
	sync ; sync


distclean : clean
	( cd javanative && if [ -f Makefile ] ; then make distclean ; fi )
	( cd javapure && if [ -f Makefile ] ; then make distclean ; fi )
	( cd rubynative && if [ -f Makefile ] ; then make distclean ; fi )
	( cd rubypure && if [ -f Makefile ] ; then make distclean ; fi )
	( cd perlnative && if [ -f Makefile ] ; then make distclean ; fi )
	( cd windows && make clean )
	( cd example && make clean )
	rm -rf Makefile estconfig hyperestraier.pc \
	  config.cache config.log config.status autom4te.cache


casket : $(MYLIBS) $(MYBINS) $(MYCGIS)
	rm -rf casket
	./estcmd create -tr -xl -attr '@uri' seq -attr '@title' str \
	  -attr '@author' str -attr '@mdate' num -attr '@size' num casket
	./estcmd gather -cl -ws -il ja -cm -sd casket .


multicasket :
	rm -rf casket casket-*
	./estcmd create -tr -xl -attr '@uri' seq -attr '@title' str \
	  -attr '@author' str -attr '@mdate' num -attr '@size' num casket-doc
	./estcmd gather -il ja casket-doc doc
	./estcmd extkeys -um casket-doc
	./estcmd gather -il ja casket-misc misc
	./estcmd extkeys -um casket-misc


scoutcasket :
	rm -rf casket casket-*
	./estcmd gather -il ja casket-0 .
	./estcmd gather -il ja casket-1 doc
	./estcmd gather -il ja casket-2 misc


nodecasket : $(MYLIBS) $(MYBINS) $(MYCGIS)
	rm -rf casket
	./estmaster init -ex casket
	./estcmd gather -cl -il ja -cm -sd casket/_node/sample0 .
	./estcmd extkeys casket/_node/sample0
	./estmaster start -bg casket ; sleep 1
	masterurl='http://admin:admin@localhost:1978/master' ; \
	  ./estcall raw "$$masterurl?action=useradd&name=mikio&passwd=oikim"
	./estcall setuser -auth admin admin 'http://localhost:1978/node/sample0' mikio 1
	./estcall setlink -auth mikio oikim 'http://localhost:1978/node/sample0' \
	  'http://localhost:1978/node/sample0' 'Sample0' 20000
	./estcall setlink -auth mikio oikim 'http://localhost:1978/node/sample0' \
	  'http://localhost:1978/node/sample1' 'Sample1' 10100
	./estcall setlink -auth mikio oikim 'http://localhost:1978/node/sample0' \
	  'http://localhost:1978/node/sample2' 'Sample2' 9800
	./estcall setlink -auth admin admin 'http://localhost:1978/node/sample1' \
	  'http://localhost:1978/node/sample0' 'Sample0' 10001
	./estcall setlink -auth admin admin 'http://localhost:1978/node/sample2' \
	  'http://localhost:1978/node/sample0' 'Sample0' 10002
	./estcall search -dpt 2 'http://localhost:1978/node/sample0' "mikio" > /dev/null
	./estcall raw \
	  'http://localhost:1978/node/sample1/search?phrase=mikio&depth=2' > /dev/null
	./estcall raw \
	  'http://localhost:1978/node/sample1/search_ui?phrase=mikio&depth=2' > /dev/null
	./estcall raw \
	  'http://localhost:1978/node/sample1/search_atom?phrase=mikio&depth=2' > /dev/null
	./estcall raw \
	  'http://localhost:1978/node/sample1/search_rss?phrase=mikio&depth=2' > /dev/null
	./estmaster stop casket


mastercasket : $(MYLIBS) $(MYBINS) $(MYCGIS)
	rm -rf casket-master
	./estmaster init casket-master
	./estmaster start -bg casket-master ; sleep 1
	masterurl='http://admin:admin@localhost:1978/master' ; \
	  ./estcall raw "$$masterurl?action=nodeadd&name=node0&label=Node0" ; \
	  ./estcall raw "$$masterurl?action=nodeadd&name=node1&label=Node1" ; \
	  ./estcall raw "$$masterurl?action=nodeadd&name=node2&label=Node2" ; \
	  ./estcall raw "$$masterurl?action=nodeadd&name=node3&label=Node3"
	./estcall setlink -auth admin admin 'http://localhost:1978/node/node0' \
	  'http://localhost:1978/node/node1' 'Node1' 10002
	./estcall setlink -auth admin admin 'http://localhost:1978/node/node0' \
	  'http://localhost:1978/node/node2' 'Node2' 10002
	./estcall setlink -auth admin admin 'http://localhost:1978/node/node0' \
	  'http://localhost:1978/node/node3' 'Node3' 10002
	./estmaster stop casket-master


wavercasket : $(MYLIBS) $(MYBINS) $(MYCGIS)
	rm -rf casket-waver
	./estwaver init casket-waver
	printf '1,$$ s/guide-en/guide-ja/\nw\n' | ex casket-waver/_conf
	printf '/qdbm/ d\nw\n' | ex casket-waver/_conf
	printf '1,$$ s/^interval:.*/interval: 0/\nw\n' | ex casket-waver/_conf
	printf '1,$$ s/^timeout:.*/timeout: 180/\nw\n' | ex casket-waver/_conf
	printf '1,$$ s/^language:.*/language: 1/\nw\n' | ex casket-waver/_conf
	printf '1,$$ s/^threadnum:.*/threadnum: 20/\nw\n' | ex casket-waver/_conf
	printf '1,$$ s/^#node/node/\nw\n' | ex casket-waver/_conf


pseudocasket :
	rm -rf casket casket-pidx
	./estcmd create -tr -xl -attr '@uri' seq -attr '@title' str \
	  -attr '@author' str -attr '@mdate' num -attr '@size' num casket
	./estcmd gather -il ja casket ./doc
	mkdir casket-pidx
	cp -f misc/*.est casket-pidx
	chmod -R 777 casket casket-pidx


check :
	rm -rf casket casket-*
	$(RUNENV) $(RUNCMD) ./estcmd create -tr -xl -attr '@uri' seq -attr '@title' str \
	  -attr '@author' str -attr '@mdate' num -attr '@size' num casket
	$(RUNENV) $(RUNCMD) ./estcmd put -ws casket ./misc/test001.est
	$(RUNENV) $(RUNCMD) ./estcmd put -ws casket ./misc/test002.est
	$(RUNENV) $(RUNCMD) ./estcmd put -ws casket ./misc/test003.est
	$(RUNENV) $(RUNCMD) ./estcmd put -cl casket ./misc/test004.est
	$(RUNENV) $(RUNCMD) ./estcmd put -cl casket ./misc/test005.est
	$(RUNENV) $(RUNCMD) ./estcmd put -cl casket ./misc/test006.est
	$(RUNENV) $(RUNCMD) ./estcmd get casket 1 > check.out
	$(RUNENV) $(RUNCMD) ./estcmd get casket 2 > check.out
	$(RUNENV) $(RUNCMD) ./estcmd get casket 3 > check.out
	$(RUNENV) $(RUNCMD) ./estcmd get casket 4 > check.out
	$(RUNENV) $(RUNCMD) ./estcmd get casket 5 > check.out
	$(RUNENV) $(RUNCMD) ./estcmd get casket 6 > check.out
	$(RUNENV) $(RUNCMD) ./estcmd get casket 1 @uri > check.out
	$(RUNENV) $(RUNCMD) ./estcmd get -pidx misc casket 2000000001 > check.out
	$(RUNENV) $(RUNCMD) ./estcmd get -pidx misc casket 2000000002 > check.out
	$(RUNENV) $(RUNCMD) ./estcmd get -pidx misc casket 2000000001 @uri > check.out
	$(RUNENV) $(RUNCMD) ./estcmd get -pidx misc casket 2000000002 @uri > check.out
	$(RUNENV) $(RUNCMD) ./estcmd list -lp casket
	$(RUNENV) $(RUNCMD) ./estcmd uriid casket "mailto:mikio@fallabs.com"
	$(RUNENV) $(RUNCMD) ./estcmd meta casket "mikio" "hirabayashi"
	$(RUNENV) $(RUNCMD) ./estcmd meta casket
	$(RUNENV) $(RUNCMD) ./estcmd search casket "Mikio Hirabayashi"
	$(RUNENV) $(RUNCMD) ./estcmd search -nl casket `printf '\xe3\x81\x93\n'` > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search -cd casket `printf '\x32\xe8\xbc\xaa\n'` > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search -nb -vu -cd casket "mikio OR enjoy OR hoge"
	$(RUNENV) $(RUNCMD) ./estcmd search -va -cd -max 1 casket "mikio OR momoyama AND GNU"
	$(RUNENV) $(RUNCMD) ./estcmd search -vf -kn 8 casket "mikio ANDNOT LGPL" > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search -vs -kn 8 casket "dream OR estraier" > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search -vh -kn 8 casket "mikio AND estraier" > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search -vx -kn 8 -sim 2 casket > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search -va -ec 0.5 casket "mikio" > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search -vs -ec -0.5 casket "estraier" > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search -vx -ec dir casket "mikio OR estraier" > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search -vu \
	  -attr "@uri STRBW http" casket "sample"
	$(RUNENV) $(RUNCMD) ./estcmd search -vu \
	  -attr '@title !ISTRINC ESTRAIER' casket "estraier"
	$(RUNENV) $(RUNCMD) ./estcmd search -vu \
	  -attr '@title ISTRRX ^est' -attr '@title !STRRX J' casket "estraier"
	$(RUNENV) $(RUNCMD) ./estcmd search -vu \
	  -attr '@title,author,to ISTRINC mikio' casket "mikio AND hirabayashi"
	$(RUNENV) $(RUNCMD) ./estcmd search -vu \
	  -attr "@cdate NUMEQ Wed, 23 Dec 2004 10:18:23 +0900" -attr "@uri STREW txt" casket
	$(RUNENV) $(RUNCMD) ./estcmd search -vu -attr '@title' -ord "@title STRA" casket "[UVSET]"
	$(RUNENV) $(RUNCMD) ./estcmd search -vu -ord "@cdate NUMD" casket "[UVSET]"
	$(RUNENV) $(RUNCMD) ./estcmd search -gf -sf -ni casket \
	  '"Hyper Estraier" miki* | *nix | put_* | *_doc' > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search -vs -hs casket \
	  '[SIMILAR] WITH 10 mikio WITH 5 unix' > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search -va -hs casket '[ID] 1' > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search -va -hs casket '[URI] data001' > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search -va -hs casket '[RANK] 5 @size' > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search -va -hs casket '[RANK] -5 @mdate' > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search -pidx misc -vx -max -1 casket "[UVSET]" > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search -pidx misc -vs -max -1 casket "mikio" > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search -pidx misc -va -max -1 \
	  -attr '@title STRINC a' -attr '@uri STRINC f' casket "estraier" > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search -pidx misc -vs -max -1 \
	  -attr '@title,@size,@uri STRINC f' -attr '@size NUMGT 0' casket "estraier" > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search -pidx misc -vs -max -1 \
	  -attr '@title,@size,@uri STRRX (a|b|0)' -ord '@size NUMD' casket "estraier" > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search -pidx misc -vf -dis '@type' \
	  casket "[UVSET]" > check.out
	$(RUNENV) $(RUNCMD) ./estcmd break "@This is a pen."
	$(RUNENV) $(RUNCMD) ./estcmd break ./misc/zen.txt > check.out
	$(RUNENV) $(RUNCMD) ./estcmd break -apn ./misc/chars.txt > check.out
	$(RUNENV) $(RUNCMD) ./estcmd break -acc ./misc/chars.txt > check.out
	$(RUNENV) $(RUNCMD) ./estcmd iconv "@This is a pen."
	$(RUNENV) $(RUNCMD) ./estcmd iconv ./misc/zen.txt > check.out
	$(RUNENV) $(RUNCMD) ./estcmd regex mikio Makefile.in > check.out
	$(RUNENV) $(RUNCMD) ./estcmd regex -repl MIKIO mikio Makefile.in > check.out
	$(RUNENV) $(RUNCMD) ./estcmd scandir -pu > check.out
	$(RUNENV) $(RUNCMD) ./estcmd scandir -td > check.out
	$(RUNENV) $(RUNCMD) ./estcmd out casket 3
	$(RUNENV) $(RUNCMD) ./estcmd out casket 4
	$(RUNENV) $(RUNCMD) ./estcmd edit casket 5 '@title' "five"
	$(RUNENV) $(RUNCMD) ./estcmd edit casket 5 '@uri' "http://five.org/5"
	$(RUNENV) $(RUNCMD) ./estcmd gather -il ja -bc -lf 0.05 -cm -cs 0.2 casket .
	$(RUNENV) $(RUNCMD) ./estcmd gather -cl -ws -il ja -lt 10 -pc UTF-8 -cm -sd casket .
	$(RUNENV) $(RUNCMD) ./estcmd extkeys -ni casket
	$(RUNENV) $(RUNCMD) ./estcmd extkeys -fc -kn 64 casket
	$(RUNENV) $(RUNCMD) ./estcmd extkeys -fc -kn 64 -um casket
	$(RUNENV) $(RUNCMD) ./estcmd words casket > check.out
	$(RUNENV) $(RUNCMD) ./estcmd draft ./misc/test003.est > check.out
	$(RUNENV) $(RUNCMD) ./estcmd draft -um ./misc/test003.est > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search -vs -hs casket \
	  '[SIMILAR] WITH 0 html WITH 5 gnu' > check.out
	$(RUNENV) $(RUNCMD) ./estcmd purge casket
	$(RUNENV) $(RUNCMD) ./estcmd optimize casket
	$(RUNENV) $(RUNCMD) ./estcmd list casket
	$(RUNENV) $(RUNCMD) ./estcmd search -vf casket \
	  "[UVSET] ANDNOT mikio" > check.out
	QUERY_STRING="phrase=mikio%20|%20estraier" \
	  $(RUNENV) $(RUNCMD) ./estseek.cgi > check.out
	QUERY_STRING="phrase=mikio&attr=@uri%20STRINC%20html" \
	  $(RUNENV) $(RUNCMD) ./estseek.cgi > check.out
	QUERY_STRING="phrase=estraier&order=@size%20NUMD" \
	  $(RUNENV) $(RUNCMD) ./estseek.cgi > check.out
	QUERY_STRING="phrase=mikio%7C%B4%B4%CD%BA&attr=&order=&perpage=5&pagenum=2&enc=EUC-JP" \
	  $(RUNENV) $(RUNCMD) ./estseek.cgi > check.out
	QUERY_STRING="similar=53&perpage=8&pagenum=2" \
	  $(RUNENV) $(RUNCMD) ./estseek.cgi > check.out
	QUERY_STRING="phrase=%5BSIMILAR%5D+WITH+2000+estraier&perpage=8&pagenum=2" \
	  $(RUNENV) $(RUNCMD) ./estseek.cgi > check.out
	QUERY_STRING="phrase=mikio%7Cestraier&clip=2&pagenum=2" \
	  $(RUNENV) $(RUNCMD) ./estseek.cgi > check.out
	PATH_INFO="/casket/inform" $(RUNENV) $(RUNCMD) ./estfraud.cgi > check.out
	PATH_INFO="/casket/search" QUERY_STRING="phrase=mikio%20|%20estraier" \
	  $(RUNENV) $(RUNCMD) ./estfraud.cgi > check.out
	PATH_INFO="/casket/search" QUERY_STRING="phrase=mikio&attr1=@uri%20STRINC%20html" \
	  $(RUNENV) $(RUNCMD) ./estfraud.cgi > check.out
	PATH_INFO="/casket/get_doc" QUERY_STRING="uri=data001" \
	  $(RUNENV) $(RUNCMD) ./estfraud.cgi > check.out
	PATH_INFO="/casket/get_doc_attr" QUERY_STRING="uri=data001&attr=@uri" \
	  $(RUNENV) $(RUNCMD) ./estfraud.cgi > check.out
	PATH_INFO="/casket/etch_doc" QUERY_STRING="uri=data002" \
	  $(RUNENV) $(RUNCMD) ./estfraud.cgi > check.out
	PATH_INFO="/casket/uri_to_id" QUERY_STRING="uri=data003" \
	  $(RUNENV) $(RUNCMD) ./estfraud.cgi > check.out
	$(RUNENV) $(RUNCMD) ./estcmd randput casket 25
	$(RUNENV) $(RUNCMD) ./estcmd search casket `printf '\xe3\x81\x93\n'` > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search casket "vw OR wx OR xy OR yz" > check.out
	$(RUNENV) $(RUNCMD) ./estcmd create \
	  -attr '@genre' str -attr '@id' num -attr '@digest' seq casket
	$(RUNENV) $(RUNCMD) ./estcmd optimize casket
	$(RUNENV) $(RUNCMD) ./estcmd wicked casket 1000
	$(RUNENV) $(RUNCMD) ./estcmd regression casket
	$(RUNENV) $(RUNCMD) ./estmttest wicked casket 1000 1
	$(RUNENV) $(RUNCMD) ./estmttest regression casket
	rm -rf casket casket-*
	$(RUNENV) $(RUNCMD) ./estcmd gather -il ja -xh -sv casket .
	$(RUNENV) $(RUNCMD) ./estcmd search -vu -hs casket "mikio OR estraier" > check.out
	$(RUNENV) $(RUNCMD) ./estcmd optimize casket
	$(RUNENV) $(RUNCMD) ./estcmd search -vu -hs casket "hyper estraier" > check.out
	$(RUNENV) $(RUNCMD) ./estcmd gather -tr -il ja -sa -ss '@size' casket .
	$(RUNENV) $(RUNCMD) ./estcmd search -vs -hs casket "mikio AND unix" > check.out
	$(RUNENV) $(RUNCMD) ./estcmd optimize casket
	$(RUNENV) $(RUNCMD) ./estcmd search -vf -hs casket "mikio NOT unix" > check.out
	rm -rf casket casket-*
	$(RUNENV) $(RUNCMD) ./estcmd create -tr -xl -attr '@uri' seq -attr '@title' str \
	  -attr '@author' str -attr '@mdate' num -attr '@size' num casket
	$(RUNENV) $(RUNCMD) ./estcmd uriid -pidx misc casket "data001"
	$(RUNENV) $(RUNCMD) ./estcmd get -pidx misc casket "data002" > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search -pidx misc -vs -hs casket "[URI] data003" > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search -pidx misc -vx -hs casket "the" > check.out
	$(RUNENV) $(RUNCMD) ./estcmd gather -il ja casket ./doc
	$(RUNENV) $(RUNCMD) ./estcmd put casket ./misc/data001.est
	$(RUNENV) $(RUNCMD) ./estcmd put casket ./misc/data002.est
	$(RUNENV) $(RUNCMD) ./estcmd extkeys casket
	$(RUNENV) $(RUNCMD) ./estcmd gather -il ja casket-child ./misc
	$(RUNENV) $(RUNCMD) ./estcmd extkeys casket-child
	$(RUNENV) $(RUNCMD) ./estcmd multi -db casket -db casket-child \
	  -cd -hs -hu -dis '@type' mikio > check.out
	$(RUNENV) $(RUNCMD) ./estcmd multi -db casket -db casket-child \
	  -cd -hs -hu -attr '@uri ISTRINC est' -max -1 -sk 10 estraier > check.out
	$(RUNENV) $(RUNCMD) ./estcmd merge casket casket-child
	$(RUNENV) $(RUNCMD) ./estcmd merge casket-child casket
	$(RUNENV) $(RUNCMD) ./estcmd merge -cl casket casket-child
	$(RUNENV) $(RUNCMD) ./estcmd search -vs -hs casket "mikio OR unix" > check.out
	rm -rf casket casket-*
	$(RUNENV) $(RUNCMD) ./estmaster unittest casket
	rm -rf casket casket-*
	$(RUNENV) $(RUNCMD) ./estwaver unittest casket
	rm -rf casket casket-*
	$(RUNENV) $(RUNCMD) ./estcmd gather -il ja -xl -kn 48 -um casket misc
	$(RUNENV) $(RUNCMD) ./estcmd search -vu -kn 32 -um -ec 0.5 -sim 2 casket > check.out
	$(RUNENV) $(RUNCMD) ./estcmd purge -cl -fc -attr '@uri STREW .html' casket
	$(RUNENV) $(RUNCMD) ./estcmd repair -rst casket
	$(RUNENV) $(RUNCMD) ./estcmd search -vf casket "[UVSET]" > check.out
	$(RUNENV) $(RUNCMD) ./estcmd search -vs -attr "@uri STRINC" casket > check.out
	$(RUNENV) $(RUNCMD) ./estcmd words -kw casket > check.out
	$(RUNENV) $(RUNCMD) ./estcmd words -kt casket > check.out
	rm -rf casket casket-*
	$(RUNENV) $(RUNCMD) ./estcmd gather -il ja casket-1 misc
	$(RUNENV) $(RUNCMD) ./estcmd gather -il ja -xl casket-2 misc
	$(RUNENV) $(RUNCMD) ./estcmd gather -il ja -xh casket-3 misc
	QUERY_STRING="phrase1=mikio&stmode=1" \
	  $(RUNENV) $(RUNCMD) ./estscout.cgi > check.out
	QUERY_STRING="phrase1=mikio&phrase2=mikio&stmode=1" \
	  $(RUNENV) $(RUNCMD) ./estscout.cgi > check.out
	QUERY_STRING="phrase1=mikio&phrase2=mikio&phrase3=mikio&stmode=1" \
	  $(RUNENV) $(RUNCMD) ./estscout.cgi > check.out
	QUERY_STRING="phrase1=mikio&phrase2=mikio&attr1=%40uri%20STRBW%20file&stmode=1" \
	  $(RUNENV) $(RUNCMD) ./estscout.cgi > check.out
	QUERY_STRING='attr1=%40uri%20ISTRRX%20(txt%7Ceml%7Chtml)%24&max=20&stmode=1' \
	  $(RUNENV) $(RUNCMD) ./estscout.cgi > check.out
	QUERY_STRING='phrase2=mikio&attr1=%40uri%20STRINC%20test&stmode=1' \
	  $(RUNENV) $(RUNCMD) ./estscout.cgi > check.out
	rm -rf casket casket-*
	@printf '\n'
	@printf '#================================================================\n'
	@printf '# Checking completed.\n'
	@printf '#================================================================\n'


check-valgrind :
	make RUNCMD="valgrind --tool=memcheck --log-fd=1" check | tee leak.log
	grep ERROR leak.log
	grep 'at exit' leak.log


check-xml :
	make casket
	./estcmd search -vx casket "mikio" > check.out ; \
	  xmllint --dtdvalid estresult.dtd --noout check.out
	./estcmd search -vx -max 3 casket "hyper estraier AND mikio" > check.out ; \
	  xmllint --dtdvalid estresult.dtd --noout check.out
	./estcmd search -vx -ec 0.5 casket "hyper estraier ANDNOT unix" > check.out ; \
	  xmllint --dtdvalid estresult.dtd --noout check.out
	./estcmd search -vx -sim 3 casket > check.out ; \
	  xmllint --dtdvalid estresult.dtd --noout check.out
	QUERY_STRING="" ./estseek.cgi | \
	  tr -d '\r' | sed -n '/^$$/,$$ p' | grep -v '^$$' > check.out ; \
	  xmllint --noout check.out
	QUERY_STRING="phrase=mikio" ./estseek.cgi | \
	  tr -d '\r' | sed -n '/^$$/,$$ p' | grep -v '^$$' > check.out ; \
	  xmllint --noout check.out
	QUERY_STRING="phrase=mikio&perpage=3&pagenum=2" ./estseek.cgi | \
	  tr -d '\r' | sed -n '/^$$/,$$ p' | grep -v '^$$' > check.out ; \
	  xmllint --noout check.out
	QUERY_STRING="phrase=mikio&detail=3" ./estseek.cgi | \
	  tr -d '\r' | sed -n '/^$$/,$$ p' | grep -v '^$$' > check.out ; \
	  xmllint --noout check.out


world :
	make
	cd javanative ; [ -f Makefile ] || ./configure ; make
	cd javapure ; [ -f Makefile ] || ./configure ; make
	cd rubynative ; [ -f Makefile ] || ./configure ; make
	cd rubypure ; [ -f Makefile ] || ./configure ; make
	cd perlnative ; [ -f Makefile ] || ./configure ; make


check-world :
	make check
	cd javanative ; [ -f Makefile ] || ./configure ; make check
	cd rubynative ; [ -f Makefile ] || ./configure ; make check
	cd perlnative ; [ -f Makefile ] || ./configure ; make check


install-world :
	make install
	cd javanative ; [ -f Makefile ] || ./configure ; make install
	cd javapure ; [ -f Makefile ] || ./configure ; make install
	cd rubynative ; [ -f Makefile ] || ./configure ; make install
	cd rubypure ; [ -f Makefile ] || ./configure ; make install
	cd perlnative ; [ -f Makefile ] || ./configure ; make install


uninstall-world :
	make uninstall
	make uninstall-fcgi
	cd javanative ; [ -f Makefile ] || ./configure ; make uninstall
	cd javapure ; [ -f Makefile ] || ./configure ; make uninstall
	cd rubynative ; [ -f Makefile ] || ./configure ; make uninstall
	cd rubypure ; [ -f Makefile ] || ./configure ; make uninstall
	cd perlnative ; [ -f Makefile ] || ./configure ; make uninstall


mac :
	make MYLIBS="$(MYMACLIBS)" CFLAGS="-Wall -fsigned-char -fno-common -O2 -DNDEBUG"


check-mac :
	make RUNENV="DYLD_LIBRARY_PATH=." check


install-mac :
	make MYLIBS="$(MYMACLIBS)" install


uninstall-mac :
	make MYLIBS="$(MYMACLIBS)" uninstall


hpux :
	make MYLIBS="$(MYHPUXLIBS)"


check-hpux :
	make RUNENV="SHLIB_PATH=." check


install-hpux :
	make MYLIBS="$(MYHPUXLIBS)" install


uninstall-hpux :
	make MYLIBS="$(MYHPUXLIBS)" uninstall


win :
	make CC="gcc -mno-cygwin" MYBINS="$(MYBINS) estmaster-sv" MYLIBS="$(MYWINLIBS)" \
	  CFLAGS="-Wall -fsigned-char -O0 -DNDEBUG" LIBS="-lqdbm -lz -liconv -lregex" \
	  MTLIBS="-lpthreadGC2" SKLIBS="-lws2_32"


winpkg :
	make win && strip *.exe
	cd javanative && ./configure && make win
	cd javapure && ./configure && make
	cd rubypure && ./configure && make
	cd windows && make
	rm -rf $(PACKAGE)
	mkdir -p $(PACKAGE)
	cp -Rf estraier.dll libestraier.dll.a estraier.h estmtdb.h \
	  estcmd.exe estmttest.exe estmaster.exe estmaster-sv.exe estbutler.exe \
	  estcall.exe estwaver.exe estload.exe \
	  estseek.cgi estfraud.cgi estproxy.cgi estscout.cgi estsupt.cgi \
	  $(MYCONFS) doc $(PACKAGE)
	rm -rf $(PACKAGE)/filter
	cp -Rf /bin/mgwz.dll /bin/libiconv-2.dll /bin/regex.dll \
	  /usr/local/bin/qdbm.dll $(PACKAGE)
	cp -Rf /bin/pthreadGC2.dll /lib/mingw/libpthreadGC2.a $(PACKAGE)
	cp -Rf /usr/local/include/depot.h /usr/local/include/curia.h \
	  /usr/local/include/cabin.h /usr/local/include/villa.h $(PACKAGE)
	cp -Rf /usr/include/mingw/pthread.h /usr/include/mingw/sched.h \
	  /usr/include/mingw/semaphore.h $(PACKAGE)
	cp -Rf /usr/local/xdoc2txt/* $(PACKAGE)
	cp -Rf javanative/estraier.jar javanative/jestraier.dll $(PACKAGE)
	cp -Rf javapure/estraierpure.jar $(PACKAGE)
	cp -Rf rubypure/estraierpure.rb rubypure/estcall.rb $(PACKAGE)
	cp -Rf windows/*.exe windows/*.bat windows/*.txt $(PACKAGE)
	zip -r $(PACKAGEDIR)-win32.zip $(PACKAGE)
	mv -f $(PACKAGEDIR)-win32.zip ..


corelib : $(MYCORELIBS)


fcgi : $(MYFCGIS)


install-fcgi :
	cp -Rf $(MYFCGIS) $(DESTDIR)$(MYLIBEXECDIR)


uninstall-fcgi :
	cd $(DESTDIR)$(MYLIBEXECDIR) && rm -f $(MYFCGIS)


.PHONY : all clean install casket check



#================================================================
# Building binaries
#================================================================


libestraier.a : $(MYLIBOBJS)
	$(AR) $(ARFLAGS) $@ $(MYLIBOBJS)


libestraier.so.$(LIBVER).$(LIBREV).0 : $(MYLIBOBJS)
	if $(CC) --print-prog-name=ld | egrep -i '(solaris|/ccs/|/ucb/)' > /dev/null ; \
	  then \
	    $(CC) -shared -Wl,-G,-h,libestraier.so.$(LIBVER) -o $@ $(MYLIBOBJS) \
	       $(LDFLAGS) $(SKLIBS) $(MTLIBS) $(LIBS) ; \
	  else \
	    $(CC) -shared -Wl,-soname,libestraier.so.$(LIBVER) -o $@ $(MYLIBOBJS) \
	       $(LDFLAGS) $(SKLIBS) $(MTLIBS) $(LIBS) ; \
	  fi


libestraier.so.$(LIBVER) : libestraier.so.$(LIBVER).$(LIBREV).0
	ln -f -s libestraier.so.$(LIBVER).$(LIBREV).0 $@


libestraier.so : libestraier.so.$(LIBVER).$(LIBREV).0
	ln -f -s libestraier.so.$(LIBVER).$(LIBREV).0 $@


libestraier.$(LIBVER).$(LIBREV).0.dylib : $(MYLIBOBJS)
	$(CC) -dynamiclib -o $@ \
	  -install_name $(MYLIBDIR)/libestraier.$(LIBVER).dylib \
	  -current_version $(LIBVER).$(LIBREV).0 \
	  -compatibility_version $(LIBVER) \
	  $(MYLIBOBJS) $(LDFLAGS) $(SKLIBS) $(MTLIBS) $(LIBS)


libestraier.$(LIBVER).dylib : libestraier.$(LIBVER).$(LIBREV).0.dylib
	ln -f -s libestraier.$(LIBVER).$(LIBREV).0.dylib $@


libestraier.dylib : libestraier.$(LIBVER).$(LIBREV).0.dylib
	ln -f -s libestraier.$(LIBVER).$(LIBREV).0.dylib $@


libestraier.sl : $(MYLIBOBJS)
	$(CC) -shared -Wl,-b -o $@ $(MYLIBOBJS)


libestraier.dll.a : estraier.dll


estraier.dll : $(MYLIBOBJS)
	$(CC) -shared -o $@ \
	  -Wl,--out-implib=lib$@.a \
	  -Wl,--export-all-symbols \
	  -Wl,--enable-auto-import \
	  -Wl,--add-stdcall-alias \
	  -Wl,--whole-archive \
	  -Wl,--no-whole-archive \
	  $(MYLIBOBJS) $(LDFLAGS) $(SKLIBS) $(MTLIBS) $(LIBS)


libestcore.a : estraier.o md5.o
	$(AR) $(ARFLAGS) $@ estraier.o md5.o


estcmd : estcmd.o mymorph.o $(MYLIBS)
	$(LDENV) $(CC) $(CFLAGS) -o $@ estcmd.o mymorph.o \
	  $(LDFLAGS) -lestraier $(APPLIBS) $(SKLIBS) $(MTLIBS) $(LIBS)


estmttest : estmttest.o $(MYLIBS)
	$(LDENV) $(CC) $(CFLAGS) -o $@ estmttest.o \
	  $(LDFLAGS) -lestraier $(APPLIBS) $(SKLIBS) $(MTLIBS) $(LIBS)


estmaster : estmaster.o mastermod.o mymorph.o $(MYLIBS)
	$(LDENV) $(CC) $(CFLAGS) -o $@ estmaster.o mastermod.o mymorph.o \
	  $(LDFLAGS) -lestraier $(APPLIBS) $(SKLIBS) $(MTLIBS) $(LIBS)


estmaster-sv : estmaster.c mastermod.o mymorph.o $(MYLIBS)
	$(LDENV) $(CC) $(CPPFLAGS) $(CFLAGS) -DMYWINSERV=1 -o $@ \
	  estmaster.c mastermod.o mymorph.o \
	  $(LDFLAGS) -lestraier $(APPLIBS) $(SKLIBS) $(MTLIBS) $(LIBS)


estbutler : estbutler.o mastermod.o $(MYLIBS)
	$(LDENV) $(CC) $(CFLAGS) -o $@ estbutler.o mastermod.o \
	  $(LDFLAGS) -lestraier $(APPLIBS) $(SKLIBS) $(MTLIBS) $(LIBS)


estcall : estcall.o $(MYLIBS)
	$(LDENV) $(CC) $(CFLAGS) -o $@ estcall.o \
	  $(LDFLAGS) -lestraier $(APPLIBS) $(SKLIBS) $(MTLIBS) $(LIBS)


estwaver : estwaver.o wavermod.o mymorph.o $(MYLIBS)
	$(LDENV) $(CC) $(CFLAGS) -o $@ estwaver.o wavermod.o mymorph.o \
	  $(LDFLAGS) -lestraier $(APPLIBS) $(SKLIBS) $(MTLIBS) $(LIBS)


estload : estload.o $(MYLIBS)
	$(LDENV) $(CC) $(CFLAGS) -o $@ estload.o \
	  $(LDFLAGS) -lestraier $(APPLIBS) $(SKLIBS) $(MTLIBS) $(LIBS)


estseek.cgi : estseek.o $(MYLIBS)
	$(LDENV) $(CC) $(CFLAGS) -o $@ estseek.o \
	  $(LDFLAGS) -lestraier $(APPLIBS) $(SKLIBS) $(MTLIBS) $(LIBS)


estseek.fcgi : estseek.c $(MYLIBS)
	$(LDENV) $(CC) $(CPPFLAGS) $(CFLAGS) -DMYFCGI -o $@ estseek.c \
	  $(LDFLAGS) -lfcgi -lestraier $(APPLIBS) $(SKLIBS) $(MTLIBS) $(LIBS)


estfraud.cgi : estfraud.o mastermod.o mymorph.o $(MYLIBS)
	$(LDENV) $(CC) $(CFLAGS) -o $@ estfraud.o mastermod.o mymorph.o \
	  $(LDFLAGS) -lestraier $(APPLIBS) $(SKLIBS) $(MTLIBS) $(LIBS)


estfraud.fcgi : estfraud.c mastermod.o mymorph.o $(MYLIBS)
	$(LDENV) $(CC) $(CPPFLAGS) $(CFLAGS) -DMYFCGI -o $@ estfraud.c mastermod.o mymorph.o \
	  $(LDFLAGS) -lfcgi -lestraier $(APPLIBS) $(SKLIBS) $(MTLIBS) $(LIBS)


estproxy.cgi : estproxy.o $(MYLIBS)
	$(LDENV) $(CC) $(CFLAGS) -o $@ estproxy.o \
	  $(LDFLAGS) -lestraier $(APPLIBS) $(SKLIBS) $(MTLIBS) $(LIBS)


estproxy.fcgi : estproxy.c $(MYLIBS)
	$(LDENV) $(CC) $(CPPFLAGS) $(CFLAGS) -DMYFCGI -o $@ estproxy.c \
	  $(LDFLAGS) -lfcgi -lestraier $(APPLIBS) $(SKLIBS) $(MTLIBS) $(LIBS)


estscout.cgi : estscout.o $(MYLIBS)
	$(LDENV) $(CC) $(CFLAGS) -o $@ estscout.o \
	  $(LDFLAGS) -lestraier $(APPLIBS) $(SKLIBS) $(MTLIBS) $(LIBS)


estscout.fcgi : estscout.c $(MYLIBS)
	$(LDENV) $(CC) $(CPPFLAGS) $(CFLAGS) -DMYFCGI -o $@ estscout.c \
	  $(LDFLAGS) -lfcgi -lestraier $(APPLIBS) $(SKLIBS) $(MTLIBS) $(LIBS)


estsupt.cgi : estsupt.o $(MYLIBS)
	$(LDENV) $(CC) $(CFLAGS) -o $@ estsupt.o \
	  $(LDFLAGS) -lestraier $(APPLIBS) $(SKLIBS) $(MTLIBS) $(LIBS)


estsupt.fcgi : estsupt.c $(MYLIBS)
	$(LDENV) $(CC) $(CPPFLAGS) $(CFLAGS) -DMYFCGI -o $@ estsupt.c \
	  $(LDFLAGS) -lfcgi -lestraier $(APPLIBS) $(SKLIBS) $(MTLIBS) $(LIBS)


estcmd.o estmttest.o mastermod.o estmaster.o estbutler.o \
  estcall.o estwaver.o estload.o \
  estseek.o estfraud.o estproxy.o estscout.o estsupt.o mymorph.o : \
  myconf.h md5.h estraier.h estmtdb.h estnode.h

mymorph.o estcmd.o estmaster.o estwaver.o estfraud.o : mymorph.h

md5.o : md5.h

estraier.o : myconf.h md5.h estraier.h

estmtdb.o : myconf.h md5.h estraier.h estmtdb.h

estnode.o : myconf.h md5.h estraier.h estmtdb.h estnode.h

mastermod.o estmaster.o estbutler.o : mastermod.h

estmaster.o : myimage.dat

wavermod.o estwaver.o : wavermod.h



# END OF FILE
