import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import { TextField, Stack } from "@mui/material";
import SendIcon from '@mui/icons-material/Send'; 

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [newComment, setNewComment] = useState("");

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const getComments = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${postId}/comments`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };
  const handleCommentClick = () => {
    setIsComments(!isComments);
    setShowCommentBox(!showCommentBox);
    getComments();
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };
  const handleCommentSubmit = async () => {
    await fetch(
      `http://localhost:3001/posts/${postId}/comments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: newComment }),
      }
    );
    getComments();
    setNewComment("");
  };
  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={handleCommentClick}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>

      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment.comment}
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
      {showCommentBox && (
        <div style={
          {marginTop: "1rem"}
        }>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              value={newComment}
              onChange={handleCommentChange}
              fullWidth
              label="Add a comment"
              variant="outlined"
            />
            <IconButton onClick={handleCommentSubmit} color="primary">
              <SendIcon />
            </IconButton>
          </Stack>
        </div>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
