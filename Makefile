DOMAIN  := zone.paw.stream-deck

PLUGINS := mmhmm
SOURCES := $(patsubst %,$(DOMAIN).%.sdPlugin,$(PLUGINS))
OUTPUTS := $(patsubst %.sdPlugin,output/%.streamDeckPlugin,$(SOURCES))

all: $(PLUGINS)

$(PLUGINS): % : output/$(DOMAIN).%.streamDeckPlugin

output/%.streamDeckPlugin: %.sdPlugin | output
	DistributionTool --build --input $< --output output

install: $(OUTPUTS)
	open $<

output:
	@mkdir -p $@

clean:
	$(RM) -r output

.PHONY: all $(PLUGINS) clean
