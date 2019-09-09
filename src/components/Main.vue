<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item @click>
          <v-list-item-action>
            <v-icon>mdi-home-circle</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click>
          <v-list-item-action>
            <v-icon>mdi-circle-double</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Beacons</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Particle Web BLE Demo</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-snackbar v-model="bleError" color="error" multi-line top>
        <v-layout align-center wrap>
          <div>
            This demo requires Web BLE, which is only available on new Chrome browsers on Android Chrome, Chromeboxes,
            some Macs and Windows PCs. It's not supported on other browsers (Firefox, Safari, Edge, Internet Explorer)
            and is not supported on Chrome for iOS.
          </div>
        </v-layout>
        <v-btn color="black" @click="bleError = false">Close</v-btn>
      </v-snackbar>
      <v-snackbar v-model="errorMsg" color="error" multi-line top>
        <v-layout align-center wrap>{{errorMsg}}</v-layout>
        <v-btn color="black" @click="errorMsg = false">Close</v-btn>
      </v-snackbar>

      <v-container fluid grid-list-md>
        <v-layout align-center justify-center wrap>
          <v-flex text-center xs12>
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn
                  color="indigo"
                  :href="source"
                  class="text-center"
                  dark
                  x-large
                  target="_blank"
                  @click="scanForDevices"
                >
                  <v-icon large>mdi-bluetooth-connect</v-icon>Scan
                </v-btn>
              </template>

              <span>Click to start scanning for BLE Devices</span>
            </v-tooltip>
          </v-flex>
          <v-flex xs12>
            <v-timeline v-if="progressItems.length > 0">
              <v-slide-x-transition group>
                <v-timeline-item
                  v-for="(item, index) in progressItems"
                  v-bind:key="index"
                  color="indigo"
                  :class="{'text-right' : index % 2 !== 0}"
                >{{ item }}</v-timeline-item>
              </v-slide-x-transition>
            </v-timeline>
          </v-flex>
          <v-flex text-center v-if="deviceFound">
            <v-spacer></v-spacer>
            <v-card class="mx-auto" max-width="400" tile>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-icon>mdi-progress-clock</v-icon>
                  <v-list-item-title>Uptime</v-list-item-title>
                  <v-list-item-subtitle>
                    <span>{{uptime}} seconds</span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item two-line>
                <v-list-item-content>
                  <v-icon>mdi-signal-variant</v-icon>
                  <v-list-item-title>Signal Strength: {{signalStrength}}%</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-progress-linear v-model="signalStrength"></v-progress-linear>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item two-line>
                <v-list-item-content>
                  <v-icon>mdi-memory</v-icon>
                  <v-list-item-title>Free Memory: {{freeMemory}} KB</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; Particle 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import BLE from "../scripts/ble.js";

export default {
  props: {
    source: String
  },
  methods: {
    scanForDevices: function(event) {
      if (navigator.bluetooth) {
        BLE.initBLE(this);
      } else {
        this.bleError = true;
      }
    }
  },

  data: () => ({
    drawer: false,
    bleError: false,
    deviceFound: false,
    freeMemory: 0,
    uptime: 0,
    signalStrength: 0,
    progressItems: [],
    errorMsg: false
  })
};
</script>