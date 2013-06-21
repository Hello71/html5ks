
"use strict";
var stub = function(){};
var LiveComposite = stub;
var im = {Composite:stub,Crop:stub,FactorScale:stub,Grayscale:stub};
html5ks.images = {
    "ev_other_iwanako_start": {
        image: "event/other_iwanako_nosnow.jpg",
        xalign: 0.5,
        yalign: 0.9,
        zoom: 1.2,
        transform: {
            type: "warp",
            seconds: 20,
            zoom: 1,
            yalign: 0.5,
        },
    },

    "ev_other_iwanako": "event/other_iwanako_nosnow.jpg",
    "evul_other_iwanako": "event/other_iwanako.jpg",

    "ev_hisao_class_start": {image:"event/hisao_class.jpg", crop: (0, 0, 800, 600)},

    "ev_hisao_class_move": {
        image: "event/hisao_class.jpg",
        xalign: 0.0,
        transform: {
            type: "warp",
            seconds: 40.0,
            xalign: 1.0,
        },
    },

    "ev_hisao_class_end": {image:"event/hisao_class.jpg", crop: (800, 0, 800, 600)},


    "ev_emi_knockeddown": "event/emi_knockeddown.jpg",

    "ev_emi_knockeddown_facepullout": {
        image: "event/emi_knockeddown_large.jpg",
        crop: (840, 50, 800, 600),
        transform:{
        type:"easeout",
        seconds:10.0,
        crop: (840, 50, 880, 660),
        }
    },

    "ev_emi_knockeddown_largepullout": {
        image: "event/emi_knockeddown.jpg",
        crop: (40, 30, 720, 540)
    },

    "ev_emi_knockeddown_face": {image:"event/emi_knockeddown_large.jpg", crop:(840, 50, 800, 600)},

    "ev_emi_knockeddown_legs": {
        crop: null,
        image: "event/emi_knockeddown_large.jpg",
        xpos: -50,
        ypos: -790,
    },

    "ev_emi_run_face_zoomin": {
        image: "event/emi_run_face.jpg",
        crop: (0, 0, 800, 600),
    },

    "ev_emi_run_face": "event/emi_run_face.jpg",

    "ev_emi_run_face_zoomout_ss": {
        filter: "sunset",
        image: "event/emi_run_face.jpg",
        crop: (40, 30, 720, 540),
    },

    "ev_emi_firstkiss": "event/emi_firstkiss.jpg",

    "insert_startpistol": "vfx/startpistol.png",

    "ev_emitrack_running": "event/emitrack_running.jpg",
    "ev_emitrack_blocks": {
        image: "event/emitrack_blocks.jpg",
        xalign: 0.0,
    },
    "ev_emitrack_blocks_close": "event/emitrack_blocks_close.jpg",
    "ev_emitrack_blocks_close_grin": "event/emitrack_blocks_close_grin.jpg",
    "ev_emitrack_finishtop": "event/emitrack_finishtop.jpg",
    "ev_emitrack_finish": "event/emitrack_finish.jpg",

    "ev_emi_sleepy": "event/emi_sleepy.jpg",
    "ev_emi_sleepy_face": "event/emi_sleepy_face.jpg",
    "ev_emi_sleepy_legs": "event/emi_sleepy_legs.jpg",

    "ev_emi_bed_frown": "event/emi_bed_frown.jpg",
    "ev_emi_bed_happy": "event/emi_bed_happy.jpg",

    "ev_emi_bed_normal": "event/emi_bed_normal.jpg",
    "ev_emi_bed_smile": "event/emi_bed_smile.jpg",
    "ev_emi_bed_unsure": "event/emi_bed_unsure.jpg",

    "ev_emi_forehead": "event/emi_forehead.jpg",

    "ev_emi_sleep_cry": "event/emi_sleep_cry.jpg",
    "ev_emi_sleep_normal": "event/emi_sleep_normal.jpg",
    "ev_emi_sleep_unsure": "event/emi_sleep_unsure.jpg",
    "ev_emi_sleep_weep": "event/emi_sleep_weep.jpg",

    "ev_emi_parkback": "event/emi_parkback.jpg",
    "ev_emi_parkback_frown": "event/emi_parkback_frown.jpg",

    "ev_emi_ending_smile": "event/emi_ending_smile.jpg",
    "ev_emi_ending_serious": "event/emi_ending_serious.jpg",
    "ev_emi_ending_glad": "event/emi_ending_glad.jpg",

    "ev_picnic_normal": {
        image: "event/picnic_normal.jpg",
        xalign: 0.5,
        yalign: 0.0,
    },
    "ev_picnic_rain": {
        image: "event/picnic_rain.jpg",
        xalign: 0.5,
        yalign: 0.0,
    },

    "ev_emi_cry_down": "event/emi_cry_down.jpg",
    "evul_emi_cry_down": {
        image: "event/emi_cry_down.jpg",
        zoom: 0.8,
    },
    "ev_emi_grave": "event/emi_grave.jpg",

    "evh_emi_grinding_victorytall": "event/emi_grinding/emi_grinding_victorytall.jpg",
    "evh_emi_grinding_victory": "event/emi_grinding/emi_grinding_victory.jpg",
    "evh_emi_grinding_wink": "event/emi_grinding/emi_grinding_wink.jpg",
    "evh_emi_grinding_grin": "event/emi_grinding/emi_grinding_grin.jpg",
    "evh_emi_grinding_half_undress": "event/emi_grinding/emi_grinding_half_undress.jpg",
    "evh_emi_grinding_half_grin": "event/emi_grinding/emi_grinding_half_grin.jpg",
    "evh_emi_grinding_off_yawn": "event/emi_grinding/emi_grinding_off_yawn.jpg",
    "evh_emi_grinding_off_closesurprise": "event/emi_grinding/emi_grinding_off_closesurprise.jpg",
    "evh_emi_grinding_off_closearoused": "event/emi_grinding/emi_grinding_off_closearoused.jpg",
    "evh_emi_grinding_off_aroused": "event/emi_grinding/emi_grinding_off_aroused.jpg",
    "evh_emi_grinding_off_arousedclosed": "event/emi_grinding/emi_grinding_off_arousedclosed.jpg",
    "evh_emi_grinding_off_come": "event/emi_grinding/emi_grinding_off_come.jpg",
    "evh_emi_grinding_off_end": "event/emi_grinding/emi_grinding_off_end.jpg",

    "evh_emi_shed_base1": "event/emi_shed/emi_shed_base1.jpg",
    "evh_emi_shed_base2": "event/emi_shed/emi_shed_base2.jpg",
    "evh_emi_shed_base3": "event/emi_shed/emi_shed_base3.jpg",
    "evh_emi_shed_base4": "event/emi_shed/emi_shed_base4.jpg",

    "evh_l_emi_shed_up": "event/emi_shed/emi_shed_lhand_up.png",
    "evh_l_emi_shed_down": "event/emi_shed/emi_shed_lhand_down.png",

    "evh_r_emi_shed_up": "event/emi_shed/emi_shed_rhand_up.png",
    "evh_r_emi_shed_down": "event/emi_shed/emi_shed_rhand_down.png",

    "hisao_emi_shed_closed": "event/emi_shed/emi_shed_hisao_closed.png",
    "hisao_emi_shed_neutral": "event/emi_shed/emi_shed_hisao_neutral.png",
    "hisao_emi_shed_sweat": "event/emi_shed/emi_shed_hisao_sweat.png",

    "emi_emi_shed_closed": "event/emi_shed/emi_shed_emi_closed.png",
    "emi_emi_shed_grin": "event/emi_shed/emi_shed_emi_grin.png",
    "emi_emi_shed_hesitant": "event/emi_shed/emi_shed_emi_hesitant.png",
    "emi_emi_shed_shock": "event/emi_shed/emi_shed_emi_shock.png",

    "evh_emi_miss_closed": "event/emi_miss_closed.jpg",
    "evh_emi_miss_open": "event/emi_miss_open.jpg",



    "prop_rin_cigarette": "vfx/prop_rin_cigarette.png",
    "prop_rin_cigarette_close": "vfx/prop_rin_cigarette_close.png",

    "ev_rin_eating": "event/rin_eating.jpg",

    "ev_rin_eating_zoomout": {
        image: "event/rin_eating.jpg",
        crop: (159, 0, 640, 480)
    },

    "evh_rin_artclass1": {
        image: "event/rin_artclass1.jpg",
        yalign: 0.5,
        xalign: 1.0
    },
    "evh_rin_artclass2": {
        image: "event/rin_artclass2.jpg",
        yalign: 0.5,
        xalign: 1.0
    },
    "evh_rin_artclass3": {
        image: "event/rin_artclass3.jpg",
        yalign: 0.5,
        xalign: 1.0
    },
    "evh_rin_artclass4": {
        image: "event/rin_artclass4.jpg",
        yalign: 0.5,
        xalign: 1.0
    },

    "evh_rin_wisp1": {
        image: "event/rin_wisp1.jpg",
        pos: "truecenter"
    },
    "evh_rin_wisp2": {
        image: "event/rin_wisp2.jpg",
        pos: "truecenter"
    },
    "evh_rin_wisp3": {
        image: "event/rin_wisp3.jpg",
        pos: "truecenter"
    },
    "evh_rin_wisp4": {
        image: "event/rin_wisp4.jpg",
        pos: "truecenter"
    },
    "evh_rin_wisp5": {
        image: "event/rin_wisp5.jpg",
        pos: "truecenter"
    },
    "ev_rin_wisp_blurred": {
        image: "event/rin_wisp_blurred.jpg",
        pos: "truecenter"
    },
    "smoke_focused": "event/rin_wisp_smoke_focused.png",
    "smoke_blurred": "event/rin_wisp_smoke_blurred.png",

    "ovl_rinbyhisao": "vfx/rinbyhisao.png",
    "ovl_hisaobyrin": "vfx/hisaobyrin.png",

    "ev_hisao_mirror": "event/hisao_mirror.jpg",
    "evh_hisao_mirror_800": {image:"event/hisao_mirror.jpg", zoom:0.8},

    "ev_busride": "event/busride.jpg",
    "ev_busride_ni": "event/busride_ni.jpg",

    "ev_rin_roof_boredom": "event/rin_roof/rin_roof_boredom.jpg",
    "ev_rin_roof_disgust": {image:"event/rin_roof/rin_roof_disgust.jpg",composite:"ev_rin_roof_boredom"},
    "ev_rin_roof_doubt": {image:"event/rin_roof/rin_roof_doubt.jpg",composite:"ev_rin_roof_boredom"},
    "ev_rin_roof_nonchalant": {image:"event/rin_roof/rin_roof_nonchalant.jpg",composite:"ev_rin_roof_boredom"},
    "ev_rin_roof_surprised": {image:"event/rin_roof/rin_roof_surprised.jpg",composite:"ev_rin_roof_boredom"},

    "hisao_rin_roof": "event/rin_roof/hisao_shadow.png",
    "emi_rin_roof": "event/rin_roof/emi_shadow.png",

    "evh_hisaobird_0": "event/hisaobird/bird_0.jpg",
    "evh_hisaobird_1": "event/hisaobird/bird_1.jpg",
    "evh_hisaobird_2": "event/hisaobird/bird_2.jpg",
    "evh_hisaobird_3": "event/hisaobird/bird_3.jpg",
    "evh_hisaobird_4": "event/hisaobird/bird_4.jpg",
    "evh_hisaobird_5": "event/hisaobird/bird_5.jpg",
    "evh_hisaobird_6": "event/hisaobird/bird_6.jpg",
    "evh_hisaobird_7": "event/hisaobird/bird_7.jpg",
    "evh_hisaobird_8": "event/hisaobird/bird_8.jpg",
    "evh_hisaobird_9": "event/hisaobird/bird_9.jpg",

    "ev_watch_black": "event/watch_black.jpg",
    "ev_watch_worn": "vfx/watch_worn.png",
    "evh_watch_worn_330": {filter:"night",image:"vfx/watch_worn_330.png"},
    "bg_watchhallway_blur": "vfx/watchhallway_blur.jpg",

    "bg_worrytree": "vfx/worrytree.jpg",
    "bg_worrytree_ss": {
        filter: "sunset",
        image: "vfx/worrytree.jpg"
    },

    "ev_rin_painting_base": "event/rin_painting_base.jpg",
    "ev_rin_painting_reply": "event/rin_painting_reply.jpg",
    "ev_rin_painting_concerned": "event/rin_painting_concerned.jpg",
    "ev_rin_painting_foot": "event/rin_painting_foot.jpg",
    "ev_rin_painting_faceconcerned": "event/rin_painting_faceconcerned.jpg",

    "ev_hisao_letter_closed": "event/hisao_letter_closed.jpg",
    "ev_hisao_letter_open": "event/hisao_letter_open.jpg",

    "ev_rin_rain_away": "event/rin_rain_away.jpg",
    "ev_rin_rain_towards": "event/rin_rain_towards.jpg",
    "ev_rin_rain_away_close": "event/rin_rain_away_close.jpg",
    "ev_rin_rain_towards_close": "event/rin_rain_towards_close.jpg",

    "ovl_rin_rain_hisaotowards_close": im.Crop("event/rin_rain_towards_close.jpg", 400, 0, 400, 1200),
    "ovl_rin_rain_hisaotowards": im.Crop("event/rin_rain_towards.jpg", 400, 0, 400, 600),

    "rin_basic_deadpan_superclose": "sprites/rin/superclose/rin_basic_deadpan_superclose.png",
    "rin_basic_deadpannormal_superclose": "sprites/rin/superclose/rin_basic_deadpannormal_superclose.png",
    "rin_basic_lucid_superclose": "sprites/rin/superclose/rin_basic_lucid_superclose.png",
    "rin_basic_crying_superclose_ss": {
        filter: "sunset",
        image: "sprites/rin/superclose/rin_basic_crying_superclose.png"
    },
    "rin_relaxed_doubt_superclose": "sprites/rin/superclose/rin_relaxed_doubt_superclose.png",
    "rin_relaxed_sleepy_superclose": "sprites/rin/superclose/rin_relaxed_sleepy_superclose.png",
    "rin_relaxed_surprised_superclose": "sprites/rin/superclose/rin_relaxed_surprised_superclose.png",
    "rin_negative_crying_superclose": "sprites/rin/superclose/rin_negative_crying_superclose.png",
    "rin_negative_crying_superclose_ss": {
        filter: "sunset",
        image: "sprites/rin/superclose/rin_negative_crying_superclose.png"
    },

    "bg_gallery_atelier_close": "vfx/gallery_atelier_close.jpg",
    "rin_back_cas_superclose": "sprites/rin/superclose/rin_back_cas_superclose.png",


    "ev_rin_kiss": "event/rin_kiss.jpg",

    "ev_rin_high_frown": "event/rin_high_frown.jpg",
    "ev_rin_high_grin": "event/rin_high_grin.jpg",
    "ev_rin_high_grinwide": "event/rin_high_grinwide.jpg",
    "ev_rin_high_oneeye": "event/rin_high_oneeye.jpg",
    "ev_rin_high_open": "event/rin_high_open.jpg",
    "ev_rin_high_sleep": "event/rin_high_sleep.jpg",
    "ev_rin_high_smile": "event/rin_high_smile.jpg",

    "ev_dandelion": "vfx/dandelion.jpg",

    "dandelion_full": "vfx/dandelion_full.png",
    "dandelion_gone": "vfx/dandelion_gone.png",
    dandelionbg: "vfx/dandelionbg.jpg",


    "ev_rin_nap_close_hand": "event/rin_nap_close_hand.jpg",
    "ev_rin_nap_close_nohand": "event/rin_nap_close_nohand.jpg",
    "ev_rin_nap_close_tears": "event/rin_nap_close_tears.png",
    "ev_rin_nap_close_wind": "event/rin_nap_close_wind.jpg",
    "ev_rin_nap_close": "event/rin_nap_close.jpg",
    "ev_rin_nap_total_tears": "event/rin_nap_total_tears.png",
    "ev_rin_nap_total_wind": "event/rin_nap_total_wind.jpg",
    "ev_rin_nap_total": "event/rin_nap_total.jpg",

    "ev_rin_nap_total_awind": {
        image: "event/rin_nap_total.jpg",
        dissolve: "ev_rin_nap_total_wind"
    },
    "ev_rin_nap_close_awind": {
        image: "event/rin_nap_close.jpg",
        dissolve: "ev_rin_nap_close_wind"
    },

    "ev_rin_nap_total_awind_tears": {
        image: "ev rin_nap_total_awind",
        composite: "ev rin_nap_total_tears"
    },
    "ev_rin_nap_close_awind_tears": {
        image: "ev rin_nap_close_awind",
        composite: "ev rin_nap_close_tears"
    },


    "ev_rin_masturbate_away": "event/rin_masturbate_away.jpg",
    "ev_rin_masturbate_surprise": "event/rin_masturbate_surprise.jpg",
    "ev_rin_masturbate_frown": "event/rin_masturbate_frown.jpg",
    "ev_rin_masturbate_doubt": "event/rin_masturbate_doubt.jpg",
    "ev_rin_masturbate_hug": "event/rin_masturbate_hug.jpg",

    "ovl_rin_galleryskylight": "event/rin_galleryskylight.jpg",

    "ev_rin_orange": "event/rin_orange.jpg",
    "ev_rin_orange_large": "event/rin_orange_large.jpg",

    "evh_rin_relief_up": "event/rin_relief_up.jpg",
    "evh_rin_relief_up_large": "event/rin_relief_up_large.jpg",
    "evh_rin_relief_down": "event/rin_relief_down.jpg",
    "evh_rin_relief_down_large": "event/rin_relief_down_large.jpg",

    "ev_rin_gallery": {
        pos: "truecenter",
        image: "event/rin_gallery.jpg"
    },

    doodlewhite: {
        image: "vfx/rin_doodle.png",
        filter: "maxbright"
    },

    "ev_rin_doodle": {
        image: "doodlewhite",
        xalign: 0.0,
        yalign: 0.0
    },

    "ev_rin_doodle_all": {
        image: "vfx/rin_doodle.png",
        pos: "truecenter",
        zoom: 0.9
    },

    "bg_misc_sky_rays": "bgs/misc_sky_rays.jpg",

    "ev_rin_trueend_gone": "event/rin_trueend/rin_trueend_gone.jpg",
    "ev_rin_trueend_gone_ni": {
        image: "event/rin_trueend/rin_trueend_gone.jpg",
        filter: "night"
    },
    "ev_rin_trueend_normal_comp": {
        image: "event/rin_trueend/rin_trueend_normal.jpg",
        xpos: 113,
        ypos: 124
    },
    "ev_rin_trueend_normal": {
        image: "ev_rin_trueend_gone",
        composite: "ev_rin_trueend_normal_comp"
    },
    "ev_rin_trueend_closed_comp": {
        xpos: 177,
        ypos: 129,
        image: "event/rin_trueend/rin_trueend_closed.jpg"
    },
    "ev_rin_trueend_closed": {
        image: "ev_rin_trueend_normal",
        composite: "ev_rin_trueend_closed_comp"
    },
    "ev_rin_trueend_sad_comp": {
        image: "event/rin_trueend/rin_trueend_sad.jpg",
        xpos: 177,
        ypos: 129
    },
    "ev_rin_trueend_sad": {
        image: "ev_rin_trueend_normal",
        composite: "ev_rin_trueend_sad_comp"
    },
    "ev_rin_trueend_smile_comp": {
        image: "event/rin_trueend/rin_trueend_smile.jpg",
        xpos: 177,
        ypos: 129
    },
    "ev_rin_trueend_smile": {
        image: "ev_rin_trueend_normal",
        composite: "ev_rin_trueend_smile_comp"
    },
    "ev_rin_trueend_weaksmile_comp": {
        image: "event/rin_trueend/rin_trueend_weaksmile.jpg",
        xpos: 177,
        ypos: 129
    },
    "ev_rin_trueend_weaksmile": {
        image: "ev_rin_trueend_normal",
        composite: "ev_rin_trueend_weaksmile_comp"
    },
    "ev_rin_trueend_hug": {
        xpos: 335,
        ypos: 51,
        image: "event/rin_trueend/rin_trueend_hug.jpg"
    },
    "ev_rin_trueend_hugclosed_comp": {
        image: "event/rin_trueend/rin_trueend_hugclosed.jpg",
        xpos: 484,
        ypos: 154
    },
    "ev_rin_trueend_hugclosed": {
        image: "ev_rin_trueend_hug",
        composite: "ev_rin_trueend_hugclosed_comp"
    },

    "ev_rin_wet_pan_down": "event/rin_wet/rin_wet_pan_down.jpg",
    "ev_rin_wet_arms": "event/rin_wet/rin_wet_arms.jpg",
    "ev_rin_wet_face_up": "event/rin_wet/rin_wet_face_up.jpg",
    "ev_rin_wet_face_down": "event/rin_wet/rin_wet_face_down.jpg",
    "ev_rin_wet_towel_up": "event/rin_wet/rin_wet_towel_up.jpg",
    "ev_rin_wet_towel_down": "event/rin_wet/rin_wet_towel_down.jpg",
    "ev_rin_wet_towel_touch": "event/rin_wet/rin_wet_towel_touch.jpg",

    "ev_rin_pair_base": "event/rin_pair/rin_pair_base.jpg",
    "ev_rin_pair_base_clothes": {
        image: "event/rin_pair/rin_pair_base.jpg",
        composite: "event/rin_pair/rin_pair_hisao_clothes.png"
    },

    "rp_hisao_frown": "event/rin_pair/rin_pair_hisao_frown.png",
    "rp_hisao_smile": "event/rin_pair/rin_pair_hisao_smile.png",
    "rp_rin_closed": "event/rin_pair/rin_pair_rin_closed.png",
    "rp_rin_frown": "event/rin_pair/rin_pair_rin_frown.png",
    "rp_rin_smile": "event/rin_pair/rin_pair_rin_smile.png",
    "rp_rin_talk": "event/rin_pair/rin_pair_rin_talk.png",

    "evh_rin_h2_surprise": "event/rin_h2/rin_h2_u_surprise.jpg",
    "evh_rin_h2_pan": {
        image: "event/rin_h2/rin_h2_l_pan.jpg",
        ypos: 300
    },
    "evh_rin_h2_pan_surprise": {
        image: "evh_rin_h2_surprise",
        composite: "evh_rin_h2_pan"
    },

    "evh_rin_h2_pan_away": {
        image: "event/rin_h2/rin_h2_u_away.jpg",
        composite: "evh_rin_h2_pan"
    },

    "evh_rin_h2_pan_closed": {
        image: "event/rin_h2/rin_h2_u_closed.jpg",
        composite: "evh_rin_h2_pan"
    },

    "evh_rin_h2_nopan": {
        image: "event/rin_h2/rin_h2_l_nopan.jpg",
        ypos: 300
    },
    "evh_rin_h2_nopan_closed": {
        image: "event/rin_h2/rin_h2_u_closed.jpg",
        composite: "evh_rin_h2_nopan"
    },

    "evh_rin_h2_hisao": {
        image: "event/rin_h2/rin_h2_l_hisao.jpg",
        ypos: 300
    },
    "evh_rin_h2_hisao_surprise": {
        image: "event/rin_h2/rin_h2_u_surprise.jpg",
        composite: "evh_rin_h2_hisao"
    },

    "evh_rin_h2_hisao_away": {
        image: "event/rin_h2/rin_h2_u_away.jpg",
        composite: "evh_rin_h2_hisao"
    },

    "evh_rin_h2_hisao_closed": {
        image: "event/rin_h2/rin_h2_u_closed.jpg",
        composite: "evh_rin_h2_hisao"
    },

    "evh_rin_h_closed": "event/rin_h/rin_h_closed.jpg",
    "evh_rin_h_left": {
        image: "event/rin_h/rin_h_left.png",
        composite: "evh_rin_h_closed"
    },
    "evh_rin_h_normal": {
        image: "event/rin_h/rin_h_normal.png",
        composite: "evh_rin_h_closed"
    },
    "evh_rin_h_right": {
        image: "event/rin_h/rin_h_right.png",
        composite: "evh_rin_h_closed"
    },
    "evh_rin_h_strain": {
        image: "event/rin_h/rin_h_strain.png",
        composite: "evh_rin_h_closed"
    },

    "evh_rin_h_closed_close": "event/rin_h/rin_h_closed_close.jpg",
    "evh_rin_h_left_close": {
        image: "event/rin_h/rin_h_closed_left.jpg",
        composite: "evh_rin_h_closed_close"
    },
    "evh_rin_h_normal_close": {
        image: "event/rin_h/rin_h_closed_normal.jpg",
        composite: "evh_rin_h_closed_close"
    },
    "evh_rin_h_right_close": {
        image: "event/rin_h/rin_h_closed_right.jpg",
        composite: "evh_rin_h_closed_close"
    },
    "evh_rin_h_strain_close": {
        image: "event/rin_h/rin_h_closed_strain.jpg",
        composite: "evh_rin_h_closed_close"
    },

    "evh_rin_goodend_1": "event/rin_goodend/rin_goodend_1.jpg",
    "evh_rin_goodend_1b": "event/rin_goodend/rin_goodend_1b.jpg",
    "evh_rin_goodend_2": "event/rin_goodend/rin_goodend_2.jpg",

    "evbg_rin_goodend_base": "event/rin_goodend/rin_goodend_base.jpg",
    "rin_goodend_1": "event/rin_goodend/rin_goodend_1.png",
    "rin_goodend_1b": "event/rin_goodend/rin_goodend_1b.png",
    "rin_goodend_2": "event/rin_goodend/rin_goodend_2.png",
    "rin_goodend_2_hires": "event/rin_goodend/rin_goodend_2_hires.png",
    "evfg_rin_goodend": "event/rin_goodend/rin_goodend_fg.png",



    "ev_lilly_tearoom": "event/lilly_tearoom.jpg",
    "ev_lilly_tearoom_open": "event/lilly_tearoom_open.jpg",

    "ev_lilly_crane": "event/lilly_crane.jpg",

    "ev_lilly_touch_uni": "event/lilly_touch_uni.jpg",
    "ev_lilly_touch_cas": {
        filter: "sunset",
        image: "event/lilly_touch_cas.jpg"
    },
    "ev_lilly_touch_cheong": "event/lilly_touch_cheong.jpg",

    "ev_braille": "vfx/braille.jpg",
    "ev_icecream": "vfx/icecream.jpg",

    "evfg_lilly_sunsetwalk": {
        image: "event/lilly_sunsetwalk_fg.png",
        filter: "sunset"
    },
    "evbg_lilly_sunsetwalk": "event/lilly_sunsetwalk_bg.jpg",

    "ev_lilly_bedroom": "event/lilly_bedroom.jpg",
    "ev_lilly_bedroom_large": "event/lilly_bedroom_large.jpg",

    "ev_lilly_hanako_hug": "event/lilly_hanako_hug.jpg",

    "ev_lilly_kissing": "event/lilly_kissing.jpg",

    "ev_lilly_sleeping": "event/lilly_sleeping.jpg",
    "ev_lilly_sleeping_smile": "event/lilly_sleeping_smile.jpg",

    train_scenery: {
        image: "event/lilly_train/train_scenery.jpg",
        xalign: 0.0,
        transition: {
            type: "linear",
            xalign: 1.0
        },
    },
    train_scenery_fg: "event/lilly_train/train_scenery_fg.png",

    "evfg_lilly_trainride": "event/lilly_train/lilly_trainride.png",
    "evfg_lilly_trainride_smile": {
        image: "event/lilly_train/lilly_trainride_smile.png",
        composite: "evfg_lilly_trainride",
        xpos: 338,
        ypos: 301
    },
    "evfg_lilly_trainride_smiles": {
        image: "event/lilly_train/lilly_trainride_hanasmile.png",
        xpos: 573,
        ypos: 331,
        composite: "evfg_lilly_trainride_smile"
    },

    "ev_lilly_trainride": "event/lilly_train/lilly_trainride.jpg",
    "ev_lilly_trainride_smiles": "event/lilly_train/lilly_trainride_smiles.jpg",

    train_scenery_ni: {
        image: "event/lilly_train/train_scenery_ni.jpg"
    },

    train_scenery_fg_ni: {
        image: "event/lilly_train/train_scenery_fg_ni.png"
    },

    lilly_trainride_ni_norm: "event/lilly_train/lilly_trainride_ni_norm.png",

    lilly_trainride_ni_ara: {
        image: "event/lilly_train/lilly_trainride_ni_ara.png",
        xpos: 321,
        ypos: 200,
        composite: "lilly_trainride_ni_norm"
    },
    lilly_trainride_ni_opensmile: {
        image: "event/lilly_train/lilly_trainride_ni_opensmile.png",
        xpos: 321,
        ypos: 200,
        composite: "lilly_trainride_ni_norm"
    },
    lilly_trainride_ni_pout: {
        image: "event/lilly_train/lilly_trainride_ni_pout.png",
        xpos: 321,
        ypos: 200,
        composite: "lilly_trainride_ni_norm"
    },
    lilly_trainride_ni_smile: {
        image: "event/lilly_train/lilly_trainride_ni_smile.png",
        xpos: 321,
        ypos: 200,
        composite: "lilly_trainride_ni_norm"
    },
    lilly_trainride_ni_weaksmile: {
        image: "event/lilly_train/lilly_trainride_ni_weaksmile.png",
        xpos: 321,
        ypos: 200,
        composite: "lilly_trainride_ni_norm"
    },


    "ev_lilly_trainride_ni": "event/lilly_train/lilly_trainride_ni.jpg",

    "ev_lilly_wheat_large": "event/lilly_wheat_large.jpg",
    "ovl_lilly_wheat_foreground": "event/lilly_wheat_foreground.png",

    "ev_lilly_wheat_small": "event/lilly_wheat_small.jpg",


    "ev_lilly_restaurant_listen": "event/lilly_restaurant_listen.jpg",
    "ev_lilly_restaurant_sheepish": "event/lilly_restaurant_sheepish.jpg",

    "evul_lilly_restaurant_listen": {
        image: "event/lilly_restaurant_listen.jpg",
        zoom: 0.8
    },
    "evul_lilly_restaurant_sheepish": {
        image: "event/lilly_restaurant_sheepish.jpg",
        zoom: 0.8
    },

    "ev_lilly_restaurant_wine": "event/lilly_restaurant_wine.jpg",
    "ev_lilly_restaurant_eat": "event/lilly_restaurant_eat.jpg",
    "ev_lilly_restaurant_chew": "event/lilly_restaurant_chew.jpg",

    "ev_hisao_teacup": "event/hisao_teacup.jpg",
    "evul_hisao_teacup": {
        image: "event/hisao_teacup.jpg",
        zoom: 0.8
    },

    "ev_akira_park": "event/akira_park.jpg",
    "evul_akira_park": {
        image: "event/akira_park.jpg",
        zoom: 0.8
    },

    "ev_lilly_sheets": "event/lilly_sheets.jpg",

    "ev_lilly_hospitalwindow": "event/lilly_hospitalwindow.jpg",


    origami_hand: {
        image: "vfx/origami_hand.png",
        filter: "night"
    },

    "ev_lilly_airport": "event/lilly_airport.jpg",
    "ev_lilly_airport_end": "event/lilly_airport_end.jpg",

    "bg_school_dormhisao_ni_fb": {filter:"past",image:"bgs/school_dormhisao_blurred_ni.jpg"},
    origami_fb: {filter:"past_night",image:"vfx/origami_hand.png"},
    "bg_shizu_houseext_lights_fb": {filter:"past",image:"bgs/shizu_houseext_lights.jpg"},
    "hideaki_serious_up_fb": {filter:"past_night",image:"sprites/hideaki/hideaki_serious_up.png"},
    "bg_hosp_ext_fb": {filter:"past_night",image:"bgs/hosp_ext.jpg"},
    crowd_still1_fb: {filter:"past_night",image:"vfx/crowd1.png"},
    crowd_still2_fb: {filter:"past_night",image:"vfx/crowd2.png"},
    "ev_lilly_airport_end_fb": {filter:"past",image:"event/lilly_airport_end.jpg"},
    "ev_lilly_hospital": "event/lilly_hospital.jpg",
    "ev_lilly_hospitalclosed": "event/lilly_hospitalclosed.jpg",

    "ev_lilly_goodend": "event/lilly_goodend.jpg",
    "evbg_lilly_goodend": "event/lilly_goodend_bg.jpg",
    "evfg_lilly_goodend": "event/lilly_goodend_fg.png",


    "evh_lilly_handjob_chest_frown": "event/lilly_handjob/lilly_hcg_handjob_chest_frown.jpg",
    "evh_lilly_handjob_chest_normal": "event/lilly_handjob/lilly_hcg_handjob_chest_normal.jpg",
    "evh_lilly_handjob_stroke_normopen": "event/lilly_handjob/lilly_hcg_handjob_stroke_normopen.jpg",

    "evh_lilly_handjob_stroke_flustopen_small": "event/lilly_handjob/lilly_hcg_handjob_stroke_flustopen_small.jpg",
    "evh_lilly_handjob_stroke_normopen_small": "event/lilly_handjob/lilly_hcg_handjob_stroke_normopen_small.jpg",
    "evh_lilly_handjob_stroke_normshut_small": "event/lilly_handjob/lilly_hcg_handjob_stroke_normshut_small.jpg",

    "evh_lilly_cowgirl_cry_small": "event/lilly_cowgirl/lilly_hcg_cowgirl_cry_small.jpg",
    "evh_lilly_cowgirl_frown_small": "event/lilly_cowgirl/lilly_hcg_cowgirl_frown_small.jpg",
    "evh_lilly_cowgirl_smile_small": "event/lilly_cowgirl/lilly_hcg_cowgirl_smile_small.jpg",
    "evh_lilly_cowgirl_strain_small": "event/lilly_cowgirl/lilly_hcg_cowgirl_strain_small.jpg",
    "evh_lilly_cowgirl_weaksmile_small": "event/lilly_cowgirl/lilly_hcg_cowgirl_weaksmile_small.jpg",

    "evh_lilly_bath_emb_small": "event/lilly_bath/lilly_hcg_bath_emb_small.jpg",
    "evh_lilly_bath_grab_small": "event/lilly_bath/lilly_hcg_bath_grab_small.jpg",
    "evh_lilly_bath_moan_small": "event/lilly_bath/lilly_hcg_bath_moan_small.jpg",
    "evh_lilly_bath_open_small": "event/lilly_bath/lilly_hcg_bath_open_small.jpg",
    "evh_lilly_bath_smile_small": "event/lilly_bath/lilly_hcg_bath_smile_small.jpg",

    "evh_lilly_afterbath_open_small": "event/lilly_afterbath/lilly_hcg_afterbath_open_small.jpg",
    "evh_lilly_afterbath_shut_small": "event/lilly_afterbath/lilly_hcg_afterbath_shut_small.jpg",

    "evh_lilly_masturbate": "event/lilly_masturbate.jpg",
    "evh_lilly_masturbate_come": "event/lilly_masturbate_come.jpg",
    "evh_lilly_masturbate_come_face": "event/lilly_masturbate_come_face.jpg",



    "ev_hana_library_read": {
        filter: "sunset",
        image: "event/hana_library_read.jpg"
    },
    "ev_hana_library": {
        filter: "sunset",
        image: "event/hana_library.jpg"
    },
    "ev_hana_library_gasp": {
        filter: "sunset",
        image: "event/hana_library_gasp.jpg"
    },
    "ev_hana_library_smile": {
        filter: "sunset",
        image: "event/hana_library_smile.jpg"
    },

    "ev_hana_library_read_std": "event/hana_library_read.jpg",
    "ev_hana_library_std": "event/hana_library.jpg",
    "ev_hana_library_gasp_std": "event/hana_library_gasp.jpg",
    "ev_hana_library_smile_std": "event/hana_library_smile.jpg",

    "evh_hanako_presents1": "event/hanako_presents1.jpg",
    "evh_hanako_presents2": "event/hanako_presents2.jpg",

    "evbg_hanako_breakdown": "event/hanako_breakdown/hanako_breakdown_bg.jpg",
    "evfg_hanako_breakdown_down": "event/hanako_breakdown/hanako_breakdown_down.png",
    "evfg_hanako_breakdown_up": im.Composite(null, (0, 0), "event/hanako_breakdown/hanako_breakdown_down.png", (588, 71), "event/hanako_breakdown/hanako_breakdown_up.jpg"),
    "evfg_hanako_breakdown_closed": im.Composite(null, (0, 0), "event/hanako_breakdown/hanako_breakdown_down.png", (588, 71), "event/hanako_breakdown/hanako_breakdown_closed.jpg"),

    "evul_hanako_breakdown_down": im.Composite(null, (0, 0), "event/hanako_breakdown/hanako_breakdown_bg.jpg", (0, 0), "event/hanako_breakdown/hanako_breakdown_down.png"),
    "evul_hanako_breakdown_up": im.Composite(null, (0, 0), "event/hanako_breakdown/hanako_breakdown_bg.jpg", (0, 0), "event/hanako_breakdown/hanako_breakdown_down.png", (588, 71), "event/hanako_breakdown/hanako_breakdown_up.jpg"),
    "evul_hanako_breakdown_closed": im.Composite(null, (0, 0), "event/hanako_breakdown/hanako_breakdown_bg.jpg", (0, 0), "event/hanako_breakdown/hanako_breakdown_down.png", (588, 71), "event/hanako_breakdown/hanako_breakdown_closed.jpg"),


    "evh_hanako_crayon1": "event/hanako_crayon1.jpg",
    "evh_hanako_crayon2": "event/hanako_crayon2.jpg",

    "ev_hanako_cry_open": "event/hanako_cry_open.jpg",
    "ev_hanako_cry_closed": "event/hanako_cry_closed.jpg",
    "ev_hanako_cry_away": "event/hanako_cry_away.jpg",

    "ev_hanako_cry_closed_fb": {filter:"past",image:"event/hanako_cry_closed.jpg"},

    hanako_door_base: "vfx/hanako_door_base.jpg",
    hanako_door_door: "vfx/hanako_door_door.jpg",

    "ev_hanako_billiards_break": "event/hanako_billiards_break.jpg",

    "ev_hanako_billiards_distant": {
        image: "event/hanako_billiards_distant.jpg",
        zoom: 0.8
    },
    "ev_hanako_billiards_distant_med": {
        image: "event/hanako_billiards_distant.jpg",
        yanchor: 0.0,
        ypos: -0.1,
        xalign: 1.0
    },

    "ev_hanako_billiards_serious": {
        image: "event/hanako_billiards_serious.jpg",
        zoom: 0.8
    },
    "ev_hanako_billiards_serious_med": {
        image: "event/hanako_billiards_serious.jpg",
        yanchor: 0.0,
        ypos: -0.1,
        xalign: 1.0
    },

    "ev_hanako_billiards_smile": {
        image: "event/hanako_billiards_smile.jpg",
        zoom: 0.8
    },
    "ev_hanako_billiards_smile_med": {
        image: "event/hanako_billiards_smile.jpg",
        yanchor: 0.0,
        ypos: -0.1,
        xalign: 1.0
    },

    "ev_hanako_billiards_smile_close": {
        image: "event/hanako_billiards_smile_close.jpg"
    },

    "ev_hanako_billiards_timid": {
        image: "event/hanako_billiards_timid.jpg",
        zoom: 0.8
    },
    "ev_hanako_billiards_timid_med": {
        image: "event/hanako_billiards_timid.jpg",
        yanchor: 0.0,
        ypos: -0.1,
        xalign: 1.0
    },

    "evul_hanako_emptyclassroom": im.FactorScale(im.Composite(null, (0, 0), "event/hanako_emptyclassroom_bg.jpg", (0, 0), "event/hanako_emptyclassroom_fg.png"), 0.8),

    "evbg_hanako_emptyclassroom": "event/hanako_emptyclassroom_bg.jpg",
    "evfg_hanako_emptyclassroom": "event/hanako_emptyclassroom_fg.png",


    "ev_hanako_dolls": "event/hanako_dolls.jpg",

    "ev_hanako_rage": "event/hanako_rage.jpg",
    "ev_hanako_rage_sad": "event/hanako_rage_sad.jpg",

    "ev_hanako_eye": "vfx/hanako_eye.jpg",

    "ev_hisao_scar_large": "event/hisao_scar_large.jpg",
    "ev_hisao_scar": "event/hisao_scar.jpg",

    "ev_hanako_scars_large": "event/hanako_scars_large.jpg",
    "ev_hanako_scars": "event/hanako_scars.jpg",

    "evh_hanako_bed_boobs_blush": "event/hanako_bed_boobs_blush.jpg",
    "evh_hanako_bed_boobs_glance": "event/hanako_bed_boobs_glance.jpg",
    "evh_hanako_bed_crotch_blush": "event/hanako_bed_crotch_blush.jpg",
    "evh_hanako_bed_crotch_glance": "event/hanako_bed_crotch_glance.jpg",

    "evh_hanako_missionary_underwear": "event/hanako_missionary_underwear.jpg",
    "evh_hanako_missionary_open": "event/hanako_missionary_open.jpg",
    "evh_hanako_missionary_closed": "event/hanako_missionary_closed.jpg",
    "evh_hanako_missionary_clench": "event/hanako_missionary_clench.jpg",

    "ev_hanako_after_worry": "event/hanako_after_worry.jpg",
    "ev_hanako_after_smile": "event/hanako_after_smile.jpg",

    "ev_hanako_park_alone": "event/hanako_park_alone.jpg",
    "ev_hanako_park_away": "event/hanako_park_away.jpg",
    "ev_hanako_park_closed": "event/hanako_park_closed.jpg",
    "ev_hanako_park_look": "event/hanako_park_look.jpg",

    "ev_hanako_goodend_close": "event/hanako_goodend_close.jpg",
    "ev_hanako_goodend_muffin": "event/hanako_goodend_muffin.jpg",
    "ev_hanako_goodend": "event/hanako_goodend.jpg",



    "ev_shizu_shanghai": "event/shizu_shanghai.jpg",
    "ev_shizu_shanghai_boredlaugh": "event/shizu_shanghai_boredlaugh.jpg",
    "ev_shizu_shanghai_borednormal": "event/shizu_shanghai_borednormal.jpg",
    "ev_shizu_shanghai_normallaugh": "event/shizu_shanghai_normallaugh.jpg",
    "ev_shizu_shanghai_smirklaugh": "event/shizu_shanghai_smirklaugh.jpg",
    "ev_shizu_shanghai_smirknormal": "event/shizu_shanghai_smirknormal.jpg",


    "ev_shizuconfess_normal": "event/shizu_yukata/shizuconfess_normal.jpg",
    "ev_shizuconfess_smile": "event/shizu_yukata/shizuconfess_smile.jpg",
    "ev_shizuconfess_closed": "event/shizu_yukata/shizuconfess_closed.jpg",

    "evbg_kenji_glasses": "event/kenji_glasses/kenji_glasses_bg.jpg",
    "evmg_kenji_glasses_normal": "event/kenji_glasses/kenji_glasses_mg.png",
    "evmg_kenji_glasses_frown": im.Composite(null, (0, 0), "event/kenji_glasses/kenji_glasses_mg.png", (400, 190), "event/kenji_glasses/kenji_glasses_frown.png"),
    "evmg_kenji_glasses_closed": im.Composite(null, (0, 0), "event/kenji_glasses/kenji_glasses_mg.png", (400, 190), "event/kenji_glasses/kenji_glasses_closed.png"),
    "evfg_kenji_glasses": "event/kenji_glasses/kenji_glasses_fg.png",


    "evul_kenji_glasses_normal": im.FactorScale(im.Composite(null, (0, 0), "event/kenji_glasses/kenji_glasses_bg.jpg", (0, 0), "event/kenji_glasses/kenji_glasses_mg.png", (0, 0), "event/kenji_glasses/kenji_glasses_fg.png"), 0.8),
    "evul_kenji_glasses_frown": im.FactorScale(im.Composite(null, (0, 0), "event/kenji_glasses/kenji_glasses_bg.jpg", (0, 0), "event/kenji_glasses/kenji_glasses_mg.png", (400, 190), "event/kenji_glasses/kenji_glasses_frown.png", (0, 0), "event/kenji_glasses/kenji_glasses_fg.png"), 0.8),
    "evul_kenji_glasses_closed": im.FactorScale(im.Composite(null, (0, 0), "event/kenji_glasses/kenji_glasses_bg.jpg", (0, 0), "event/kenji_glasses/kenji_glasses_mg.png", (400, 190), "event/kenji_glasses/kenji_glasses_closed.png", (0, 0), "event/kenji_glasses/kenji_glasses_fg.png"), 0.8),


    "ev_shizutanabata": "event/shizu_yukata/shizutanabata.jpg",

    "ev_shizu_flashback": "event/shizu_flashback.jpg",

    "ev_shizu_hands": "event/shizu_hands.jpg",

    "ev_shizune_car": {
        image: "event/shizune_car.jpg",
        yalign: 0.5,
        xalign: 0.0,
        transition: {
            type: "easein",
            seconds: 12.0,
            xalign: 1.0
        },
    },

    "ev_shizu_fishing_sl": "event/shizu_fishing_sl.jpg",
    "ev_shizu_fishing_ah": "event/shizu_fishing_ah.jpg",

    "ev_shizu_couch": "event/shizu_couch.jpg",

    "ev_shizu_roof": "event/shizu_roof/shizu_roof.jpg",
    "ev_shizu_roof_towardsangry": im.Composite(null, (0, 0), "event/shizu_roof/shizu_roof.jpg", (299, 296), "event/shizu_roof/shizu_roof_towardsangry.jpg"),
    "ev_shizu_roof_towardsnormal": im.Composite(null, (0, 0), "event/shizu_roof/shizu_roof.jpg", (299, 296), "event/shizu_roof/shizu_roof_towardsnormal.jpg"),
    "ev_shizu_roof_smile": im.Composite(null, (0, 0), "event/shizu_roof/shizu_roof.jpg", (299, 296), "event/shizu_roof/shizu_roof_smile.jpg"),

    "evh_shizu_roof2": im.Composite(null, (0, 0), "event/shizu_roof/shizu_roof.jpg", (601, 316), "event/shizu_roof/shizu_roof_hisao2.jpg"),
    "evh_shizu_roof2_towardsangry": im.Composite(null, (0, 0), "event/shizu_roof/shizu_roof.jpg", (601, 316), "event/shizu_roof/shizu_roof_hisao2.jpg", (299, 296), "event/shizu_roof/shizu_roof_towardsangry.jpg"),
    "evh_shizu_roof2_towardsnormal": im.Composite(null, (0, 0), "event/shizu_roof/shizu_roof.jpg", (601, 316), "event/shizu_roof/shizu_roof_hisao2.jpg", (299, 296), "event/shizu_roof/shizu_roof_towardsnormal.jpg"),
    "evh_shizu_roof2_smile": im.Composite(null, (0, 0), "event/shizu_roof/shizu_roof.jpg", (601, 316), "event/shizu_roof/shizu_roof_hisao2.jpg", (299, 296), "event/shizu_roof/shizu_roof_smile.jpg"),

    "evh_shizune_hcg_tied_blush_small": "event/shizune_hcg_tied/shizune_hcg_tied_blush_small.jpg",
    "evh_shizune_hcg_tied_blush": "event/shizune_hcg_tied/shizune_hcg_tied_blush.jpg",
    "evh_shizune_hcg_tied_close_small": "event/shizune_hcg_tied/shizune_hcg_tied_close_small.jpg",
    "evh_shizune_hcg_tied_close": "event/shizune_hcg_tied/shizune_hcg_tied_close.jpg",
    "evh_shizune_hcg_tied_kinky1_small": "event/shizune_hcg_tied/shizune_hcg_tied_kinky1_small.jpg",

    "evh_shizune_hcg_tied_kinky2_small": "event/shizune_hcg_tied/shizune_hcg_tied_kinky2_small.jpg",
    "evh_shizune_hcg_tied_kinky2": "event/shizune_hcg_tied/shizune_hcg_tied_kinky2.jpg",
    "evh_shizune_hcg_tied_kinky3_small": "event/shizune_hcg_tied/shizune_hcg_tied_kinky3_small.jpg",

    "evh_shizune_hcg_tied_smile_small": "event/shizune_hcg_tied/shizune_hcg_tied_smile_small.jpg",

    "evh_shizune_hcg_tied_stare_small": "event/shizune_hcg_tied/shizune_hcg_tied_stare_small.jpg",
    "evh_shizune_hcg_tied_stare": "event/shizune_hcg_tied/shizune_hcg_tied_stare.jpg",

    evh_hi_shizune_hcg_tied_hisao2: im.Composite((1600, 1200), (1080, 290), "event/shizune_hcg_tied/shizune_hcg_tied_hisao2.png"),
    evh_hi_shizune_hcg_tied_hisao2_small: im.Composite((800, 600), (540, 145), "event/shizune_hcg_tied/shizune_hcg_tied_hisao2_small.png"),


    evhul_shizune_hcg_tied_hisao2_small: im.Composite((800, 600), (0, 0), "event/shizune_hcg_tied/shizune_hcg_tied_kinky3_small.jpg", (540, 145), "event/shizune_hcg_tied/shizune_hcg_tied_hisao2_small.png"),


    "evh_shizu_undressing_clothed_stare": "event/shizu_undressing/shizu_undressing_clothed_stare.jpg",
    "evh_shizu_undressing_clothed_kiss": "event/shizu_undressing/shizu_undressing_clothed_kiss.jpg",
    "evh_shizu_undressing_clothed_blush": "event/shizu_undressing/shizu_undressing_clothed_blush.jpg",
    "evh_shizu_undressing_unclothed_blush": "event/shizu_undressing/shizu_undressing_unclothed_blush.jpg",
    "evh_shizu_undressing_unclothed_closed": "event/shizu_undressing/shizu_undressing_unclothed_closed.jpg",
    "evh_shizu_undressing_unclothed_kiss": "event/shizu_undressing/shizu_undressing_unclothed_kiss.jpg",
    "evh_shizu_undressing_unclothed_talk": "event/shizu_undressing/shizu_undressing_unclothed_talk.jpg",

    "evh_shizu_pushdown": "event/shizu_pushdown.jpg",

    "evh_shizu_straddle_open": {
        image: "event/shizu_straddle_open.jpg",
        xalign: 0.7,
        yalign: 1.0
    },
    "evh_shizu_straddle_tease": "event/shizu_straddle_tease.jpg",
    "evh_shizu_straddle_closed": "event/shizu_straddle_closed.jpg",
    "evh_shizu_straddle_smile": "event/shizu_straddle_smile.jpg",
    "evh_shizu_straddle_come": "event/shizu_straddle_come.jpg",

    "evh_shizu_table_smile": "event/shizu_table_smile.jpg",
    "evh_shizu_table_normal": "event/shizu_table_normal.jpg",
    "evh_shizu_table_comeopen": "event/shizu_table_comeopen.jpg",
    "evh_shizu_table_comeclosed": "event/shizu_table_comeclosed.jpg",

    "ev_misha_sad": "event/misha_sad.jpg",

    "ev_misha_nightclass": "event/misha_nightclass.jpg",
    "ovl_misha_nightclass_aperture": "vfx/misha_nightclass_aperture.png",

    "evh_misha_naked": {
        image: "event/misha_naked.jpg",
        xalign: 0.0,
        yalign: 0.0
    },
    "evh_misha_sex_aside": "event/misha_sex_aside.jpg",
    "evh_misha_sex_closed": "event/misha_sex_closed.jpg",

    "ev_misha_roof_normal": {
        image: "event/misha_roof_normal.jpg",
        xalign: 0.5,
        yalign: 0.0
    },
    "ev_misha_roof_angry": "event/misha_roof_angry.jpg",
    "ev_misha_roof_closed": "event/misha_roof_closed.jpg",
    "ev_misha_roof_sad": "event/misha_roof_sad.jpg",

    aoi_keiko: {
        filter: "sunset",
        image: "vfx/aoi_keiko.png"
    },

    "ev_shizu_goodend": {
        image: "event/shizu_goodend.jpg",
        xalign: 0.5,
        yalign: 1.0
    },

    "ev_shizu_goodend_pan": {
        image: "event/shizu_goodend.jpg",
        xalign: 0.5,
        yalign: 1.0,
        transition: {
            seconds: 15.0,
            yalign: 0.0
        },
    },

    "ev_shizu_badend": "event/shizu_badend.jpg",


    "ev_showdown": "event/lilly_shizu_showdown.jpg",
    "ev_showdown_large": "event/lilly_shizu_showdown_large.jpg",
    "ev_showdown_lilly": im.Crop("event/lilly_shizu_showdown_large.jpg", 280, 100, 800, 600),
    "ev_showdown_shizu": im.Crop("event/lilly_shizu_showdown_large.jpg", 1400, 160, 800, 600),

    showdown_lilly_slice: im.Crop("event/lilly_shizu_showdown_large.jpg", 440, 260, 800, 299),
    showdown_shizu_slice: im.Crop("event/lilly_shizu_showdown_large.jpg", 1360, 320, 800, 299),


    "ev_kenji_rooftop": "event/kenji_rooftop.jpg",
    "ev_kenji_rooftop_large": "event/kenji_rooftop_large.jpg",
    "ev_kenji_rooftop_kenji": im.Crop("event/kenji_rooftop_large.jpg", 288, 376, 800, 600),




    "bg_tearoom_lillyhisao_noon": "event/Lilly_supercg/tearoom_lillyhisao_noon.jpg",
    "bg_tearoom_lillyhisao_sunset": "event/Lilly_supercg/tearoom_lillyhisao_sunset.jpg",

    tearoom_hisao_calm: "event/Lilly_supercg/tearoom_hisao_calm.png",
    tearoom_hisao_oops: "event/Lilly_supercg/tearoom_hisao_oops.png",
    tearoom_hisao_outside: "event/Lilly_supercg/tearoom_hisao_outside.png",
    tearoom_hisao_relief: "event/Lilly_supercg/tearoom_hisao_relief.png",
    tearoom_hisao_sigh: "event/Lilly_supercg/tearoom_hisao_sigh.png",
    tearoom_hisao_smile: "event/Lilly_supercg/tearoom_hisao_smile.png",
    tearoom_hisao_think: "event/Lilly_supercg/tearoom_hisao_think.png",
    tearoom_hisao_thinkclosed: "event/Lilly_supercg/tearoom_hisao_thinkclosed.png",
    tearoom_hisao_unsure: "event/Lilly_supercg/tearoom_hisao_unsure.png",

    tearoom_lilly_ara: "event/Lilly_supercg/tearoom_lilly_ara.png",
    tearoom_lilly_giggle: "event/Lilly_supercg/tearoom_lilly_giggle.png",
    tearoom_lilly_smileclosed: "event/Lilly_supercg/tearoom_lilly_smileclosed.png",
    tearoom_lilly_thinking: "event/Lilly_supercg/tearoom_lilly_thinking.png",
    tearoom_lilly_weaksmile: "event/Lilly_supercg/tearoom_lilly_weaksmile.png",

    "bg_tearoom_everyone_noon": "event/Lilly_supercg/tearoom_everyone_noon.jpg",

    tearoom_hanae_happy: "event/Lilly_supercg/tearoom_hanae_happy.png",
    tearoom_hanae_open: "event/Lilly_supercg/tearoom_hanae_open.png",
    tearoom_hanae_sad: "event/Lilly_supercg/tearoom_hanae_sad.png",
    tearoom_hanae_shy: "event/Lilly_supercg/tearoom_hanae_shy.png",

    tearoom_lillye_ara: "event/Lilly_supercg/tearoom_lillye_ara.png",
    tearoom_lillye_giggle: "event/Lilly_supercg/tearoom_lillye_giggle.png",
    tearoom_lillye_smileclosed: "event/Lilly_supercg/tearoom_lillye_smileclosed.png",
    tearoom_lillye_thinking: "event/Lilly_supercg/tearoom_lillye_thinking.png",
    tearoom_lillye_weaksmile: "event/Lilly_supercg/tearoom_lillye_weaksmile.png",
    tearoom_lillye_smile: "event/Lilly_supercg/tearoom_lillye_smile.png",

    tearoom_hisaoe_calm: "event/Lilly_supercg/tearoom_hisaoe_calm.png",
    tearoom_hisaoe_outside: "event/Lilly_supercg/tearoom_hisaoe_outside.png",
    tearoom_hisaoe_sigh: "event/Lilly_supercg/tearoom_hisaoe_sigh.png",
    tearoom_hisaoe_thinkclosed: "event/Lilly_supercg/tearoom_hisaoe_thinkclosed.png",
    tearoom_hisaoe_hoops: "event/Lilly_supercg/tearoom_hisaoe_hoops.png",
    tearoom_hisaoe_hrelief: "event/Lilly_supercg/tearoom_hisaoe_hrelief.png",
    tearoom_hisaoe_hsmile: "event/Lilly_supercg/tearoom_hisaoe_hsmile.png",
    tearoom_hisaoe_hthink: "event/Lilly_supercg/tearoom_hisaoe_hthink.png",
    tearoom_hisaoe_hunsure: "event/Lilly_supercg/tearoom_hisaoe_hunsure.png",
    tearoom_hisaoe_loops: "event/Lilly_supercg/tearoom_hisaoe_loops.png",
    tearoom_hisaoe_relief: "event/Lilly_supercg/tearoom_hisaoe_relief.png",
    tearoom_hisaoe_lsmile: "event/Lilly_supercg/tearoom_hisaoe_lsmile.png",
    tearoom_hisaoe_lthink: "event/Lilly_supercg/tearoom_hisaoe_lthink.png",
    tearoom_hisaoe_lunsure: "event/Lilly_supercg/tearoom_hisaoe_lunsure.png",

    tearoom_chess: "event/Lilly_supercg/tearoom_chess.png",



    "ev_shizu_chess_large": "event/shizu_supercg/shizu_chess_large.jpg",
    "ev_shizu_chess_base": "event/shizu_supercg/shizu_chess_base.jpg",
    "evh_shizu_chess_base2": "event/shizu_supercg/shizu_chess_base2.jpg",
    "evh_shizu_chess_base3": "event/shizu_supercg/shizu_chess_base3.jpg",

    sc_shiz_normal: im.Crop("event/shizu_supercg/shizu_chess_base3.jpg", 400, 0, 400, 600),




    "kenji_silhouette": "sprites/kenji/kenji_neutral_silhouette.png",
    "kenji_silhouette_naked": "sprites/kenji/kenji_neutral_naked_silhouette.png",
    "hanako_silhouette": "sprites/hanako/hanako_basic_bashful_silhouette.png",
    "rin_silhouette": "sprites/rin/rin_relaxed_surprised_silhouette.png",

    shizuepiccomp: im.Composite((874, 836), (0, 0), ("sprites/shizu/close/shizu_out_serious_close_silhouette.png"), (2.5, 600), ("vfx/shizu_out_serious_legs_silhouette.png")),

    shizuepiccomp_sil: im.Composite((874, 836), (0, 0), ("sprites/shizu/close/shizu_out_serious_close_silhouette.png"), (2.5, 600), ("vfx/shizu_out_serious_legs_silhouette.png")),

    ksgallerybg: "ui/tc-neutral.png",

    bloodred: "#d00",
    white: "#fff",
    pink: "#FF7FD4",
    videowhite: "#e9e9e7",
    videoblack: "#0d0d0d",
    darkgrey: "#0D0D0D",
    "bg_school_roof_ni_crop": im.Crop("bgs/school_roof_ni.jpg", 200, 0, 800, 600),
    n_vignette: "vfx/narrowvignette.png",

    fw_screen: ("#000000CC"),

    fakenvltextbox: "ui/bg-nvl.png",

    hisaowindow: "vfx/hisaowindow.png",

    "bg_mural_start": "vfx/mural_start.jpg",
    "bg_mural_unfinished": "vfx/mural_unfinished.jpg",
    "bg_mural_part": "vfx/mural.jpg",
    "mural_all": "vfx/mural_wide.jpg",
    "bg_mural": "vfx/mural.jpg",
    "bg_mural_ss": {
        filter: "sunset",
        image: "vfx/mural.jpg"
    },
    "mural_pan": "vfx/mural.jpg",

    rin_exhibition_paintings: "vfx/rin_exhibition_paintings.jpg", 
    rin_exhibition_sold: "vfx/rin_exhibition_sold.jpg",
    rin_exhibition_c: "vfx/rin_exhibition_c.jpg",

    rin_shadow_basic: {
        image: "sprites/rin/close/rin_basic_deadpan_close.png",
        filter: "shadowalpha"
    },
    rin_shadow_negative: {
        image: "sprites/rin/close/rin_negative_spaciness_close.png",
        filter: "shadowalpha"
    },

    "nightsky_rotation": {
        image: "bgs/misc_sky_ni.jpg"
    },

    "cityscape_zoom": {
        image: "vfx/cityscape.png"
    },

    "hill_enter": {
        image: "vfx/hillouette.png"
    },

    "hill_pairtouch": "vfx/hillpair1.png",
    "hill_pairnotouch": "vfx/hillpair2.png",

    nightwash: "vfx/nightwash.png",

    noiseoverlay: "vfx/noise1.png",

    comic_vfx1: "vfx/comic_vfx1.png",
    comic_vfx2: "vfx/comic_vfx2.png",
    comic_vfx3: "vfx/comic_vfx3.png",
    comic_vfx4: "vfx/comic_vfx4.png",

    "ev_emi_bed_full": LiveComposite((800, 1280), (0, 0), "event/emi_bed_normal.jpg", (0, 600), "event/emi_bed_legs.jpg"),

    passoutOP1: "ui/tr-flashback.png",


    wine: "vfx/wine.png",
    "musicbox_open": "vfx/musicbox_open.png",
    "musicbox_closed": "vfx/musicbox_closed.png",
    boxstrip: "vfx/boxstrip.png",
    teaset: "vfx/teaset.png",
    stuffedcat: "vfx/stuffedcat.png",
    chessboard: "vfx/chessboard.png",
    shangpai: "vfx/shangpai.png",
    pills: "vfx/pills.png",
    invite: "vfx/invite.png",
    brailler: "vfx/brailler.png",
    sc_comp: "vfx/sc_comp.png",
    letter_insert: "vfx/letter_insert.png",
    letter_open_insert: "vfx/letter_open_insert.png",

    hanaphone: "vfx/hanaphone.png",
    phonestrap: "vfx/phonestrap.png",
    hanaphonestrap: "vfx/hanaphonestrap.png",

    kenjibox: "vfx/kenjibox.png",

    jigorocard: "vfx/jigorocard.png",

    stallphoto_insert: "vfx/stallphoto_insert.png",

    "lilly_superclose": "vfx/lilly_superclose.png",
    "lilly_superclose_ouch": "vfx/lilly_superclose_ouch.png",
    "lilly_superclose_shock": "vfx/lilly_superclose_shock.png",


    blanknote: "vfx/note_blur.png",

    "lillyprop_back_cane": "vfx/prop_lilly_back_cane.png",
    "lillyprop_back_cane_close": "vfx/prop_lilly_back_cane_close.png",
    "lillyprop_back_cane_ss": {
        filter: "sp_sunset",
        image: "vfx/prop_lilly_back_cane.png"
    },
    "lillyprop_back_cane_ni": {
        filter: "sp_night",
        image: "vfx/prop_lilly_back_cane.png"
    },

    "bg_gallery_atelier_bw": im.Grayscale("bgs/gallery_atelier.jpg"),
    "bg_school_scienceroom_bw": im.Grayscale("bgs/school_scienceroom.jpg"),
    "bg_school_library_bw": im.Grayscale("bgs/school_library.jpg"),
    bg_city_street4_bw: im.Grayscale("bgs/city_street4.jpg"),
    bg_city_street3_bw: im.Grayscale("bgs/city_street3.jpg"),
    "bg_school_council_bw": im.Grayscale("bgs/school_council.jpg"),
    "bg_school_dormhisao_bw": im.Grayscale("bgs/school_dormhisao.jpg"),



    "ev_hanako_shanghaiwindow": "event/hanako_fw.jpg",

    "bg_school_library_yuuko_blurred": "vfx/school_library_yuuko_blurred.jpg",

    "phone_mobile": "vfx/mobile-sprite.png",
    "black": "#000000"

};
