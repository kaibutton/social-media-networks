// User Class
class User {
    constructor(username, age, gender) {
      this.username = username;
      this.age = age;
      this.gender = gender;
      this.posts = [];
      this.comments = [];
      this.viewedPosts = [];
      this.following = [];
      this.followers = 0;
    }
  
    createPost(content) {
      const post = new Post(this, content);
      this.posts.push(post);
      return post;
    }
  
    commentOnPost(post, content) {
      const comment = new Comment(this, content);
      post.comments.push(comment);
      this.comments.push(comment);
    }
  
    viewPost(post) {
      const view = new View(new Date());
      if (!post.usersWhoViewed.includes(this)) {
        post.usersWhoViewed.push(this);
        post.views += 1;
        this.viewedPosts.push(post);
      }
    }
  
    follow(user) {
      if (!this.following.includes(user)) {
        this.following.push(user);
        user.followers++;
      }
    }
  }
  
  // Comment Class
  class Comment {
    constructor(author, content) {
      this.user = author;
      this.content = content;
      this.date = new Date();
    }
  }
  
  // Post Class
  class Post {
    constructor(author, content) {
      this.author = author;
      this.content = content;
      this.comments = [];
      this.usersWhoViewed = [];
      this.views = 0;
      this.date = new Date();
    }
  }
  
  // View Class
  class View {
    constructor(date) {
      this.date = date;
    }
  }

// Merge Sort Function
function mergeSort(arr) {
    // Base case: if the array has one or zero elements, it's already sorted
    if (arr.length <= 1) {
      return arr;
    }
  
    // Split the array in half
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
  
    // Recursively sort both halves
    const sortedLeft = mergeSort(left);
    const sortedRight = mergeSort(right);
  
    // Merge the sorted halves and return the result
    return merge(sortedLeft, sortedRight);
  }
  
  // Merge function that merges two sorted arrays in descending order
  function merge(left, right) {
    let result = [];
    let i = 0;
    let j = 0;
  
    // Merge until one of the arrays is exhausted
    while (i < left.length && j < right.length) {
      if (left[i][1] > right[j][1]) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
    }
  
    // If there are remaining elements in the left array, add them to the result
    while (i < left.length) {
      result.push(left[i]);
      i++;
    }
  
    // If there are remaining elements in the right array, add them to the result
    while (j < right.length) {
      result.push(right[j]);
      j++;
    }
  
    return result;
  }

  
  // --- VISUALIZATION USING VIS.JS ---
  
  // Create users
  const Ari = new User("Ari", 25, "Female");
  const Justin = new User("Justin", 30, "Male");
  const Jesse = new User("Jesse", 28, "Female");
  const Ashlyn = new User("Ashlyn", 23, "Female");
  
  // Create follows
  Ari.follow(Justin);
  Ari.follow(Jesse);
  Jesse.follow(Ari);
  Jesse.follow(Justin);
  Ashlyn.follow(Ari);
  Ashlyn.follow(Justin);
  
  // Create Posts
  const gameNight = Ari.createPost("Great game tonight!");
  const work = Justin.createPost("I'm kinda tired from work today...");
  const bike = Justin.createPost("Just got a new bike!");
  const applesNOranges = Jesse.createPost("Apples are better than oranges");

  // Create views
  Jesse.viewPost(gameNight);
  Jesse.viewPost(work);
  Ari.viewPost(applesNOranges);
  Ari.viewPost(bike);
  Justin.viewPost(applesNOranges);
  Justin.viewPost(gameNight);
  Ashlyn.viewPost(work);
  Ashlyn.viewPost(applesNOranges);
  Ashlyn.viewPost(bike);


  // Create Comments
  Jesse.commentOnPost(gameNight, "Yessuh!");
  Justin.commentOnPost(gameNight, "I'm glad we won!");
  Jesse.commentOnPost(work, "Why are you tired?");
  Ari.commentOnPost(applesNOranges, "I disagree >:)");
  Ashlyn.commentOnPost(bike, "ooh, what kind?");
  
  // Create nodes and edges for Vis.js
  const nodes = new vis.DataSet();
  const edges = new vis.DataSet();

    // Sorting a list of users by followers
    const userFollowerMap = new Map();
    userFollowerMap.set(Ari, Ari.followers);
    userFollowerMap.set(Justin, Justin.followers);
    userFollowerMap.set(Jesse, Jesse.followers);
    userFollowerMap.set(Ashlyn, Ashlyn.followers);
    const sortedEntries = mergeSort(...userFollowerMap.entries());
    console.log(sortedEntries);
  
  // Add user nodes (blue)
  [Ari, Justin, Jesse, Ashlyn].forEach((user) => {
    const nodeSize = ((user.followers + 1) * 20);
    const popUP = `Followers: ${user.followers}`;
    nodes.add({
      id: user.username,
      label: `${user.username}`,
      title: popUP,
      color: "#2adefe",
      shape: "square",
      size: nodeSize,
      scaling: {
        min: 20,
        max: 80,
      }
    });
  });
  
// Add post nodes (green) and connect to authors, including comments in the label
[Ari.posts, Justin.posts, Jesse.posts, Ashlyn.posts].flat().forEach((post, index) => {
    const postId = `post-${index}`;
    
    // Generate the list of comments for this post
    const commentsList = `Views: ${post.views}\nComments:\n${post.comments.map(comment => `${comment.user.username}: ${comment.content}\n`)}`;
    
    // If there are no comments, set the label to just the post content
    const postLabel = `Post: ${post.content}`;
    
    nodes.add({
      id: postId,
      label: postLabel,
      title: commentsList,
      color: "#aeff5c",
      shape: "box",
    });
    
    edges.add({
      from: post.author.username,
      to: postId,
      arrows: "to",
    });
  });
  
  
  // Add following edges
  [Ari, Justin, Jesse, Ashlyn].forEach((user) => {
    user.following.forEach((followedUser) => {
      edges.add({
        from: user.username,
        to: followedUser.username,
        arrows: "to",
        color: "gray"
      });
    });
  });
  
  // Visualization options
  const options = {
    nodes: {
      font: {
        size: 16,
      },
    },
    edges: {
      arrows: "to",
      color: { inherit: false },
      smooth: true,
    },
    physics: {
      enabled: false,
    },
  };
  
  // Initialize the Vis.js network
  const container = document.getElementById("network");
  const data = { nodes, edges };
  const network = new vis.Network(container, data, options);
  
  const numeroUno = 6;
  //document.getElementById("H1text").innerText = `Most followers: ${} Count: ${}`;