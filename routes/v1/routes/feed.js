const express = require("express");
const sizeOf = require("image-size");
const router = express.Router();

const User = require("../../../models/User");
const Post = require("../../../models/Post");
const Follow = require("../../../models/Follow");
const Like = require("../../../models/Like");
const Comment = require("../../../models/Comment");

const auth = require("../../../middleware/auth");

router.get("/user/:id", auth, async (req, res) => {
  try {
    const accountId = req.cookies.ds_user_id;

    const id = req.params.id;

    // Retrieve username based on ID
    const user = await User.findOne({ userID: id }).exec();
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
        error_type: "not_found",
      });
    }

    const fullArray = [];

    // get posts from the newest to the oldest
    const posts = await Post.find({ uploadedBy: id })
      .sort({ postTimestamp: -1 })
      .exec();
    const postCount = posts.length;

    // Loop through each post
    for (const post of posts) {
      if (post) {
        const dimensions = sizeOf(post.mediaURI);
        const width = dimensions.width;
        const height = dimensions.height;

        // check if logged in user has liked the post
        const hasLiked = await Like.findOne({
          from: accountId,
          to: post.postID,
          type: "post",
        });

        const likes = await Like.find({
          to: post.postID,
          type: "post",
        }).countDocuments();
        const comments = await Comment.find({
          to: post.postID,
        }).countDocuments();

        const itemTwo = {
          taken_at: Math.floor(post.postTimestamp.getTime() / 1000),
          pk: parseInt(post.postPK),
          id: post.postID,
          hide_view_all_comment_entrypoint: false,
          is_visual_reply_commenter_notice_enabled: true,
          like_and_view_counts_disabled: false,
          is_post_live_clips_media: false,
          is_reshare_of_text_post_app_media_in_ig: false,
          explore_hide_comments: false,
          comment_threading_enabled: true,
          is_unified_video: false,
          has_privately_liked: false,
          commerciality_status: "not_commercial",
          filter_type: 0,
          client_cache_key: "0",
          integrity_review_decision: "pending",
          device_timestamp: null,
          caption_is_edited: false,
          strong_id__: post.postID,
          deleted_reason: 0,
          has_shared_to_fb: 0,
          should_request_ads: false,
          has_delayed_metadata: false,
          mezql_token: "",
          preview_comments: [],
          comment_count: comments,
          inline_composer_display_condition: "impression_trigger",
          is_comments_gif_composer_enabled: true,
          comment_inform_treatment: {
            should_have_inform_treatment: false,
            text: "",
            url: null,
            action_type: null,
          },
          has_liked: hasLiked ? true : false,
          like_count: likes,
          facepile_top_likers: [],
          top_likers: [],
          clips_tab_pinned_user_ids: [],
          can_viewer_save: true,
          can_viewer_reshare: true,
          shop_routing_user_id: null,
          is_organic_product_tagging_eligible: true,
          product_suggestions: [],
          commerce_integrity_review_decision: "",
          comments: [],
          can_view_more_preview_comments: false,
          has_more_comments: false,
          max_num_visible_preview_comments: 2,
          is_open_to_public_submission: false,
          usertags: { in: [] },
          photo_of_you: false,
          can_see_insights_as_brand: false,
          media_type: 1,
          code: "code",
          caption: post.description
            ? {
                bit_flags: 0,
                created_at: Math.floor(post.createdAt.getTime() / 1000),
                created_at_utc: Math.floor(post.createdAt.getTime() / 1000),
                did_report_as_spam: false,
                is_ranked_comment: false,
                pk: post.postPK,
                share_enabled: false,
                content_type: "comment",
                media_id: post.postPK,
                status: "Active",
                type: 1,
                user_id: user.userID,
                text: post.description,
                user: {
                  fbid_v2: parseInt(user.userID),
                  feed_post_reshare_disabled: false,
                  full_name: user.fullname,
                  id: user.userID,
                  is_private: user.private,
                  is_unpublished: false,
                  pk: parseInt(user.userID),
                  pk_id: user.userID,
                  show_account_transparency_details: true,
                  strong_id__: user.userID,
                  third_party_downloads_enabled: 2,
                  username: user.username,
                  account_badges: [],
                  has_anonymous_profile_picture: false,
                  is_favorite: false,
                  is_verified: user.verified,
                  latest_reel_media: 0,
                  profile_pic_id: user.userID,
                  profile_pic_url: user.profilePicture,
                  transparency_product_enabled: false,
                },
                is_covered: false,
                private_reply_status: 0,
              }
            : null,
          sharing_friction_info: {
            should_have_sharing_friction: false,
            bloks_app_url: null,
            sharing_friction_payload: null,
          },
          original_media_has_visual_reply_media: false,
          fb_user_tags: {
            in: [],
          },
          invited_coauthor_producers: [],
          is_in_profile_grid: false,
          profile_grid_control_enabled: false,
          highlights_info: {
            added_to: [],
          },
          user: {
            fbid_v2: parseInt(user.userID),
            feed_post_reshare_disabled: false,
            full_name: user.fullname,
            id: user.userID,
            is_private: user.private,
            is_unpublished: false,
            pk: parseInt(user.userID),
            pk_id: user.userID,
            show_account_transparency_details: true,
            strong_id__: user.userID,
            third_party_downloads_enabled: 2,
            username: user.username,
            account_badges: [],
            has_anonymous_profile_picture: false,
            is_favorite: false,
            is_verified: user.verified,
            latest_reel_media: 0,
            profile_pic_id: user.userID,
            profile_pic_url: user.profilePicture,
            transparency_product_enabled: false,
          },
          image_versions2: {
            candidates: [
              {
                width: width,
                height: height,
                url: post.mediaURL,
              },
            ],
          },
          original_width: width,
          original_height: height,
          enable_media_notes_production: false,
          product_type: "feed",
          is_paid_partnership: false,
          music_metadata: {
            music_canonical_id: "0",
            audio_type: null,
            music_info: null,
            original_sound_info: null,
            pinned_media_ids: null,
          },
          social_context: [],
          organic_tracking_token: "fucktracking",
          ig_media_sharing_disabled: false,
          boost_unavailable_identifier: null,
          boost_unavailable_reason: null,
          is_auto_created: false,
          is_cutout_sticker_allowed: false,
          is_reuse_allowed: false,
          enable_waist: false,
          owner: {
            fbid_v2: parseInt(user.userID),
            feed_post_reshare_disabled: false,
            full_name: user.fullname,
            id: user.userID,
            is_private: user.private,
            is_unpublished: false,
            pk: parseInt(user.userID),
            pk_id: user.userID,
            show_account_transparency_details: true,
            strong_id__: user.userID,
            third_party_downloads_enabled: 2,
            username: user.username,
            account_badges: [],
            has_anonymous_profile_picture: false,
            is_favorite: false,
            is_verified: user.verified,
            latest_reel_media: 0,
            profile_pic_id: user.userID,
            profile_pic_url: user.profilePicture,
            transparency_product_enabled: false,
          },
          fb_aggregated_like_count: 0,
          fb_aggregated_comment_count: 0,
          logging_info_token: null,
          inventory_source: "media_or_ad",
          is_seen: false,
          is_eof: false,
          ranking_weight: 0.0,
          brs_severity: 70,
        };

        fullArray.push(itemTwo);
      }
    }

    res.json({
      num_results: postCount,
      more_available: false,
      items: fullArray,
      user: {
        pk: parseInt(user.userID),
        pk_id: user.userID,
        username: user.username,
        full_name: user.fullname,
        is_private: user.private,
        has_onboarded_to_text_post_app: false,
        strong_id__: user.userID,
        profile_grid_display_type: "default",
        is_verified: user.verified,
        profile_pic_id: user.userID,
        profile_pic_url: user.profilePicture,
        can_see_quiet_post_attribution: false,
      },
      auto_load_more_enabled: true,
      status: "ok",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", status: "fail" });
  }
});

router.post("/timeline", auth, async (req, res) => {
  try {
    const { ds_user_id } = req.cookies;

    const account = await User.findOne({ userID: ds_user_id });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const fullArray = [];

    const follows = await Follow.find({ from: account.userID });
    const followedUserIds = follows.map((follow) => follow.to);
    const posts = await Post.find({
      uploadedBy: { $in: followedUserIds },
    }).sort({ postTimestamp: -1 });

    const postCount = posts.length;

    // Loop through each post
    for (const post of posts) {
      if (post) {
        const user = await User.findOne({ userID: post.uploadedBy });

        const dimensions = sizeOf(post.mediaURI);
        const width = dimensions.width;
        const height = dimensions.height;

        // check if logged in user has liked the post
        const hasLiked = await Like.findOne({
          from: account.userID,
          to: post.postID,
          type: "post",
        });

        const likes = await Like.find({
          to: post.postID,
          type: "post",
        }).countDocuments();

        const comments = await Comment.find({
          to: post.postID,
        }).countDocuments();

        const itemTwo = {
          taken_at: Math.floor(post.postTimestamp.getTime() / 1000),
          pk: parseInt(post.postPK),
          id: post.postID,
          hide_view_all_comment_entrypoint: false,
          is_visual_reply_commenter_notice_enabled: true,
          like_and_view_counts_disabled: false,
          is_post_live_clips_media: false,
          is_reshare_of_text_post_app_media_in_ig: false,
          explore_hide_comments: false,
          comment_threading_enabled: true,
          is_unified_video: false,
          has_privately_liked: false,
          commerciality_status: "not_commercial",
          filter_type: 0,
          client_cache_key: "0",
          integrity_review_decision: "pending",
          device_timestamp: null,
          caption_is_edited: false,
          strong_id__: post.postID,
          deleted_reason: 0,
          has_shared_to_fb: 0,
          should_request_ads: false,
          has_delayed_metadata: false,
          mezql_token: "",
          preview_comments: [],
          comment_count: comments,
          inline_composer_display_condition: "impression_trigger",
          is_comments_gif_composer_enabled: true,
          comment_inform_treatment: {
            should_have_inform_treatment: false,
            text: "",
            url: null,
            action_type: null,
          },
          has_liked: hasLiked ? true : false,
          like_count: likes,
          facepile_top_likers: [],
          top_likers: [],
          clips_tab_pinned_user_ids: [],
          can_viewer_save: true,
          can_viewer_reshare: true,
          shop_routing_user_id: null,
          is_organic_product_tagging_eligible: true,
          product_suggestions: [],
          commerce_integrity_review_decision: "",
          comments: [],
          can_view_more_preview_comments: false,
          has_more_comments: false,
          max_num_visible_preview_comments: 2,
          is_open_to_public_submission: false,
          usertags: { in: [] },
          photo_of_you: false,
          can_see_insights_as_brand: false,
          media_type: 1,
          code: "code",
          caption: post.description
            ? {
                bit_flags: 0,
                created_at: Math.floor(post.createdAt.getTime() / 1000),
                created_at_utc: Math.floor(post.createdAt.getTime() / 1000),
                did_report_as_spam: false,
                is_ranked_comment: false,
                pk: post.postPK,
                share_enabled: false,
                content_type: "comment",
                media_id: post.postPK,
                status: "Active",
                type: 1,
                user_id: user.userID,
                text: post.description,
                user: {
                  fbid_v2: parseInt(user.userID),
                  feed_post_reshare_disabled: false,
                  full_name: user.fullname,
                  id: user.userID,
                  is_private: user.private,
                  is_unpublished: false,
                  pk: parseInt(user.userID),
                  pk_id: user.userID,
                  show_account_transparency_details: true,
                  strong_id__: user.userID,
                  third_party_downloads_enabled: 2,
                  username: user.username,
                  account_badges: [],
                  has_anonymous_profile_picture: false,
                  is_favorite: false,
                  is_verified: user.verified,
                  latest_reel_media: 0,
                  profile_pic_id: user.userID,
                  profile_pic_url: user.profilePicture,
                  transparency_product_enabled: false,
                },
                is_covered: false,
                private_reply_status: 0,
              }
            : null,
          sharing_friction_info: {
            should_have_sharing_friction: false,
            bloks_app_url: null,
            sharing_friction_payload: null,
          },
          original_media_has_visual_reply_media: false,
          fb_user_tags: {
            in: [],
          },
          invited_coauthor_producers: [],
          is_in_profile_grid: false,
          profile_grid_control_enabled: false,
          highlights_info: {
            added_to: [],
          },
          user: {
            fbid_v2: parseInt(user.userID),
            feed_post_reshare_disabled: false,
            full_name: user.fullname,
            id: user.userID,
            is_private: user.private,
            is_unpublished: false,
            pk: parseInt(user.userID),
            pk_id: user.userID,
            show_account_transparency_details: true,
            strong_id__: user.userID,
            third_party_downloads_enabled: 2,
            username: user.username,
            account_badges: [],
            has_anonymous_profile_picture: false,
            is_favorite: false,
            is_verified: user.verified,
            latest_reel_media: 0,
            profile_pic_id: user.userID,
            profile_pic_url: user.profilePicture,
            transparency_product_enabled: false,
          },
          image_versions2: {
            candidates: [
              {
                width: width,
                height: height,
                url: post.mediaURL,
              },
            ],
          },
          original_width: width,
          original_height: height,
          enable_media_notes_production: false,
          product_type: "feed",
          is_paid_partnership: false,
          music_metadata: {
            music_canonical_id: "0",
            audio_type: null,
            music_info: null,
            original_sound_info: null,
            pinned_media_ids: null,
          },
          social_context: [],
          organic_tracking_token: "fucktracking",
          ig_media_sharing_disabled: false,
          boost_unavailable_identifier: null,
          boost_unavailable_reason: null,
          is_auto_created: false,
          is_cutout_sticker_allowed: false,
          is_reuse_allowed: false,
          enable_waist: false,
          owner: {
            fbid_v2: parseInt(user.userID),
            feed_post_reshare_disabled: false,
            full_name: user.fullname,
            id: user.userID,
            is_private: user.private,
            is_unpublished: false,
            pk: parseInt(user.userID),
            pk_id: user.userID,
            show_account_transparency_details: true,
            strong_id__: user.userID,
            third_party_downloads_enabled: 2,
            username: user.username,
            account_badges: [],
            has_anonymous_profile_picture: false,
            is_favorite: false,
            is_verified: user.verified,
            latest_reel_media: 0,
            profile_pic_id: user.userID,
            profile_pic_url: user.profilePicture,
            transparency_product_enabled: false,
          },
          fb_aggregated_like_count: 0,
          fb_aggregated_comment_count: 0,
          logging_info_token: null,
          inventory_source: "media_or_ad",
          is_seen: false,
          is_eof: false,
          ranking_weight: 0.0,
          brs_severity: 70,
        };

        fullArray.push(itemTwo);
      }
    }

    return res.json({
      num_results: postCount,
      more_available: false,
      auto_load_more_enabled: false,
      is_direct_v2_enabled: false,
      next_max_id: null,
      view_state_version: null,
      client_feed_changelist_applied: false,
      request_id: null,
      ad_request_id: 0,
      pull_to_refresh_window_ms: 5000,
      preload_distance: 4,
      status: "ok",
      client_gap_enforcer_matrix: [
        [1, 1],
        [1, 1],
      ],
      feed_pill_text: "New Posts",
      hide_like_and_view_counts: 0,
      max_num_possible_ad_insertions: 0,
      last_head_load_ms: null,
      btp_type: "ig_total_timespent",
      is_shell_response: false,
      items: fullArray,
      feed_items_media_info: [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/timeline", auth, async (req, res) => {
  try {
    const { ds_user_id, sessionid } = req.cookies;

    const account = await User.findOne({ userID: ds_user_id });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const fullArray = [];

    const follows = await Follow.find({ from: account.userID });
    const followedUserIds = follows.map((follow) => follow.to);
    const posts = await Post.find({
      uploadedBy: { $in: followedUserIds },
    }).sort({ postTimestamp: -1 });

    const postCount = posts.length;

    // Loop through each post
    for (const post of posts) {
      if (post) {
        const user = await User.findOne({ userID: post.uploadedBy });

        const dimensions = sizeOf(post.mediaURI);
        const width = dimensions.width;
        const height = dimensions.height;

        // check if logged in user has liked the post
        const hasLiked = await Like.findOne({
          from: account.userID,
          to: post.postID,
          type: "post",
        });

        const likes = await Like.find({
          to: post.postID,
          type: "post",
        }).countDocuments();

        const comments = await Comment.find({
          to: post.postID,
        }).countDocuments();

        const itemTwo = {
          taken_at: Math.floor(post.postTimestamp.getTime() / 1000),
          pk: parseInt(post.postPK),
          id: post.postID,
          hide_view_all_comment_entrypoint: false,
          is_visual_reply_commenter_notice_enabled: true,
          like_and_view_counts_disabled: false,
          is_post_live_clips_media: false,
          is_reshare_of_text_post_app_media_in_ig: false,
          explore_hide_comments: false,
          comment_threading_enabled: true,
          is_unified_video: false,
          has_privately_liked: false,
          commerciality_status: "not_commercial",
          filter_type: 0,
          client_cache_key: "0",
          integrity_review_decision: "pending",
          device_timestamp: null,
          caption_is_edited: false,
          strong_id__: post.postID,
          deleted_reason: 0,
          has_shared_to_fb: 0,
          should_request_ads: false,
          has_delayed_metadata: false,
          mezql_token: "",
          preview_comments: [],
          comment_count: comments,
          inline_composer_display_condition: "impression_trigger",
          is_comments_gif_composer_enabled: true,
          comment_inform_treatment: {
            should_have_inform_treatment: false,
            text: "",
            url: null,
            action_type: null,
          },
          has_liked: hasLiked ? true : false,
          like_count: likes,
          facepile_top_likers: [],
          top_likers: [],
          clips_tab_pinned_user_ids: [],
          can_viewer_save: true,
          can_viewer_reshare: true,
          shop_routing_user_id: null,
          is_organic_product_tagging_eligible: true,
          product_suggestions: [],
          commerce_integrity_review_decision: "",
          comments: [],
          can_view_more_preview_comments: false,
          has_more_comments: false,
          max_num_visible_preview_comments: 2,
          is_open_to_public_submission: false,
          usertags: { in: [] },
          photo_of_you: false,
          can_see_insights_as_brand: false,
          media_type: 1,
          code: "code",
          caption: post.description
            ? {
                bit_flags: 0,
                created_at: Math.floor(post.createdAt.getTime() / 1000),
                created_at_utc: Math.floor(post.createdAt.getTime() / 1000),
                did_report_as_spam: false,
                is_ranked_comment: false,
                pk: post.postPK,
                share_enabled: false,
                content_type: "comment",
                media_id: post.postPK,
                status: "Active",
                type: 1,
                user_id: user.userID,
                text: post.description,
                user: {
                  fbid_v2: parseInt(user.userID),
                  feed_post_reshare_disabled: false,
                  full_name: user.fullname,
                  id: user.userID,
                  is_private: user.private,
                  is_unpublished: false,
                  pk: parseInt(user.userID),
                  pk_id: user.userID,
                  show_account_transparency_details: true,
                  strong_id__: user.userID,
                  third_party_downloads_enabled: 2,
                  username: user.username,
                  account_badges: [],
                  has_anonymous_profile_picture: false,
                  is_favorite: false,
                  is_verified: user.verified,
                  latest_reel_media: 0,
                  profile_pic_id: user.userID,
                  profile_pic_url: user.profilePicture,
                  transparency_product_enabled: false,
                },
                is_covered: false,
                private_reply_status: 0,
              }
            : null,
          sharing_friction_info: {
            should_have_sharing_friction: false,
            bloks_app_url: null,
            sharing_friction_payload: null,
          },
          original_media_has_visual_reply_media: false,
          fb_user_tags: {
            in: [],
          },
          invited_coauthor_producers: [],
          is_in_profile_grid: false,
          profile_grid_control_enabled: false,
          highlights_info: {
            added_to: [],
          },
          user: {
            fbid_v2: parseInt(user.userID),
            feed_post_reshare_disabled: false,
            full_name: user.fullname,
            id: user.userID,
            is_private: user.private,
            is_unpublished: false,
            pk: parseInt(user.userID),
            pk_id: user.userID,
            show_account_transparency_details: true,
            strong_id__: user.userID,
            third_party_downloads_enabled: 2,
            username: user.username,
            account_badges: [],
            has_anonymous_profile_picture: false,
            is_favorite: false,
            is_verified: user.verified,
            latest_reel_media: 0,
            profile_pic_id: user.userID,
            profile_pic_url: user.profilePicture,
            transparency_product_enabled: false,
          },
          image_versions2: {
            candidates: [
              {
                width: width,
                height: height,
                url: post.mediaURL,
              },
            ],
          },
          original_width: width,
          original_height: height,
          enable_media_notes_production: false,
          product_type: "feed",
          is_paid_partnership: false,
          music_metadata: {
            music_canonical_id: "0",
            audio_type: null,
            music_info: null,
            original_sound_info: null,
            pinned_media_ids: null,
          },
          social_context: [],
          organic_tracking_token: "fucktracking",
          ig_media_sharing_disabled: false,
          boost_unavailable_identifier: null,
          boost_unavailable_reason: null,
          is_auto_created: false,
          is_cutout_sticker_allowed: false,
          is_reuse_allowed: false,
          enable_waist: false,
          owner: {
            fbid_v2: parseInt(user.userID),
            feed_post_reshare_disabled: false,
            full_name: user.fullname,
            id: user.userID,
            is_private: user.private,
            is_unpublished: false,
            pk: parseInt(user.userID),
            pk_id: user.userID,
            show_account_transparency_details: true,
            strong_id__: user.userID,
            third_party_downloads_enabled: 2,
            username: user.username,
            account_badges: [],
            has_anonymous_profile_picture: false,
            is_favorite: false,
            is_verified: user.verified,
            latest_reel_media: 0,
            profile_pic_id: user.userID,
            profile_pic_url: user.profilePicture,
            transparency_product_enabled: false,
          },
          fb_aggregated_like_count: 0,
          fb_aggregated_comment_count: 0,
          logging_info_token: null,
          inventory_source: "media_or_ad",
          is_seen: false,
          is_eof: false,
          ranking_weight: 0.0,
          brs_severity: 70,
        };

        fullArray.push(itemTwo);
      }
    }

    return res.json({
      num_results: postCount,
      more_available: false,
      auto_load_more_enabled: false,
      is_direct_v2_enabled: false,
      next_max_id: null,
      view_state_version: null,
      client_feed_changelist_applied: false,
      request_id: null,
      ad_request_id: 0,
      pull_to_refresh_window_ms: 5000,
      preload_distance: 4,
      status: "ok",
      client_gap_enforcer_matrix: [
        [1, 1],
        [1, 1],
      ],
      feed_pill_text: "New Posts",
      hide_like_and_view_counts: 0,
      max_num_possible_ad_insertions: 0,
      last_head_load_ms: null,
      btp_type: "ig_total_timespent",
      is_shell_response: false,
      items: fullArray,
      feed_items_media_info: [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/liked", auth, async (req, res) => {
  try {
    const { ds_user_id } = req.cookies;

    const account = await User.findOne({ userID: ds_user_id });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const fullArray = [];

    const likes = await Like.find({ from: account.userID, type: "post" }).sort({
      createdAt: -1,
    });

    const postCount = likes.length;

    // Loop through each post
    for (const like of likes) {
      if (like) {
        const post = await Post.findOne({ postID: like.to });

        const user = await User.findOne({ userID: post.uploadedBy });

        const dimensions = sizeOf(post.mediaURI);
        const width = dimensions.width;
        const height = dimensions.height;

        // check if logged in user has liked the post
        const hasLiked = await Like.findOne({
          from: account.userID,
          to: post.postID,
          type: "post",
        });

        const likes = await Like.find({
          to: post.postID,
          type: "post",
        }).countDocuments();
        const comments = await Comment.find({
          to: post.postID,
        }).countDocuments();

        const item = {
          taken_at: Math.floor(post.postTimestamp.getTime() / 1000),
          pk: post.postPK,
          id: post.postID,
          hide_view_all_comment_entrypoint: false,
          is_visual_reply_commenter_notice_enabled: true,
          like_and_view_counts_disabled: false,
          sticker_translations_enabled: false,
          is_post_live_clips_media: false,
          is_reshare_of_text_post_app_media_in_ig: false,
          explore_hide_comments: false,
          comment_threading_enabled: true,
          is_unified_video: true,
          has_privately_liked: false,
          commerciality_status: "not_commercial",
          filter_type: 0,
          client_cache_key: null,
          integrity_review_decision: "pending",
          device_timestamp: null,
          caption_is_edited: false,
          strong_id__: post.postID,
          deleted_reason: 0,
          has_shared_to_fb: 0,
          should_request_ads: false,
          has_delayed_metadata: false,
          is_quiet_post: false,
          mezql_token: "",
          commenting_disabled_for_viewer: false,
          preview_comments: [],
          comment_count: comments,
          inline_composer_display_condition: "impression_trigger",
          inline_composer_imp_trigger_time: 5,
          is_comments_gif_composer_enabled: true,
          comment_inform_treatment: {
            should_have_inform_treatment: false,
            text: "",
            url: null,
            action_type: null,
          },
          has_hidden_comments: false,
          has_liked: hasLiked ? true : false,
          like_count: likes,
          top_likers: [],
          clips_tab_pinned_user_ids: [],
          can_viewer_save: true,
          can_viewer_reshare: true,
          shop_routing_user_id: null,
          is_organic_product_tagging_eligible: false,
          featured_products: [],
          product_suggestions: [],
          can_view_more_preview_comments: false,
          has_more_comments: false,
          max_num_visible_preview_comments: 2,
          likers: [],
          is_open_to_public_submission: false,
          can_see_insights_as_brand: false,
          media_type: 1,
          code: "code",
          caption: post.description
            ? {
                bit_flags: 0,
                created_at: Math.floor(post.createdAt.getTime() / 1000),
                created_at_utc: Math.floor(post.createdAt.getTime() / 1000),
                did_report_as_spam: false,
                is_ranked_comment: false,
                pk: post.postPK,
                share_enabled: false,
                content_type: "comment",
                media_id: post.postPK,
                status: "Active",
                type: 1,
                user_id: user.userID,
                text: post.description,
                user: {
                  pk: user.userID,
                  pk_id: user.userID,
                  id: user.userID,
                  username: user.username,
                  full_name: user.fullname,
                  is_private: user.private,
                  has_onboarded_to_text_post_app: false,
                  strong_id__: user.userID,
                  fbid_v2: user.userID,
                  is_verified: user.verified,
                  profile_pic_id: "2832243363949919680_43034513011",
                  profile_pic_url: user.profilePicture,
                },
                is_covered: false,
                private_reply_status: 0,
              }
            : null,
          is_in_profile_grid: false,
          profile_grid_control_enabled: false,
          highlights_info: {
            added_to: [],
          },
          user: {
            allowed_commenter_type: "any",
            fbid_v2: user.userID,
            feed_post_reshare_disabled: false,
            full_name: user.fullname,
            has_onboarded_to_text_post_app: false,
            id: user.userID,
            is_private: user.private,
            is_unpublished: false,
            pk: user.userID,
            pk_id: user.userID,
            reel_auto_archive: "on",
            show_account_transparency_details: true,
            show_insights_terms: false,
            strong_id__: user.userID,
            third_party_downloads_enabled: 0,
            username: user.username,
            account_badges: [],
            can_boost_post: false,
            can_see_organic_insights: false,
            fan_club_info: {
              fan_club_id: null,
              fan_club_name: null,
              is_fan_club_referral_eligible: null,
              fan_consideration_page_revamp_eligiblity: null,
              is_fan_club_gifting_eligible: null,
              subscriber_count: null,
              connected_member_count: null,
              autosave_to_exclusive_highlight: null,
              has_enough_subscribers_for_ssc: null,
            },
            has_anonymous_profile_picture: false,
            interop_messaging_user_fbid: 17842303733433012,
            is_verified: user.verified,
            liked_clips_count: 0,
            profile_pic_id: "2832243363949919680_43034513011",
            profile_pic_url: user.profilePicture,
            transparency_product_enabled: false,
          },
          image_versions2: {
            candidates: [
              {
                width: width,
                height: height,
                url: post.mediaURL,
                scans_profile: "",
                estimated_scans_sizes: [],
              },
            ],
          },
          original_width: width,
          original_height: height,
          enable_media_notes_production: false,
          product_type: "feed",
          is_paid_partnership: false,
          music_metadata: {
            music_canonical_id: "0",
            audio_type: null,
            music_info: null,
            original_sound_info: null,
            pinned_media_ids: null,
          },
          organic_tracking_token: "",
          ig_media_sharing_disabled: false,
          boost_unavailable_identifier: null,
          boost_unavailable_reason: null,
          is_auto_created: false,
          is_cutout_sticker_allowed: false,
          is_reuse_allowed: false,
          enable_waist: true,
          owner: {
            allowed_commenter_type: "any",
            fbid_v2: user.userID,
            feed_post_reshare_disabled: false,
            full_name: user.fullname,
            has_onboarded_to_text_post_app: false,
            id: user.userID,
            is_private: user.private,
            is_unpublished: false,
            pk: user.userID,
            pk_id: user.userID,
            reel_auto_archive: "on",
            show_account_transparency_details: true,
            show_insights_terms: false,
            strong_id__: user.userID,
            third_party_downloads_enabled: 0,
            username: user.username,
            account_badges: [],
            can_boost_post: false,
            can_see_organic_insights: false,
            fan_club_info: {
              fan_club_id: null,
              fan_club_name: null,
              is_fan_club_referral_eligible: null,
              fan_consideration_page_revamp_eligiblity: null,
              is_fan_club_gifting_eligible: null,
              subscriber_count: null,
              connected_member_count: null,
              autosave_to_exclusive_highlight: null,
              has_enough_subscribers_for_ssc: null,
            },
            has_anonymous_profile_picture: false,
            interop_messaging_user_fbid: 17842303733433012,
            is_verified: user.verified,
            profile_pic_id: "2832243363949919680_43034513011",
            profile_pic_url: user.profilePicture,
            transparency_product_enabled: false,
          },
          fb_aggregated_like_count: 0,
          fb_aggregated_comment_count: 0,
        };

        fullArray.push(item);
      }
    }

    return res.json({
      items: fullArray,
      num_results: postCount,
      more_available: false,
      auto_load_more_enabled: false,
      status: "ok",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
