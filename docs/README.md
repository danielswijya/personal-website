# Tachyo Image Enrichment Method

_This is an end-to-end pipeline that links WordNet 3.1 to WordNet 3.0 synsets and enriches them with images from various sources, including BabelNet, OpenVerse, Wikimedia, and ImageNet. The images are then scored for relevance and diversity using OpenAI's CLIP model, with the final results displayed in a React front-end._

---

## Tools Used

- **Python**
- **MongoDB**
- **PyTorch + CLIP**
- **APIs:** BabelNet, OpenVerse, Wikimedia Commons
- **CairoSVG** (for converting SVG files to PNG)

---

## Summary of Inputs & Outputs

### Inputs

Data is sourced from the `synsets` collection with the following key fields:

- **name:** Used to match the synset for image collection.
- **lemma_names:** Used for querying candidate images and for CLIP.
- **pwn_offset:** The WordNet 3.1 ID used to correspond to an existing or non-existent ImageNet folder and data.
- **definition:** The text used for CLIP prompts.
- **part_of_speech:** A category used to check if a synset is a noun (for ImageNet) and for general documentation.

### Outputs

Results are stored in the `synset_images` collection. Below is a sample of the output document structure. Please be aware that there are more strategies for the CLIP:

There are:

- "clip*selected_images_70_imagenet_30_babelnet_then_70_imageref_combined*+\_30_text"
- clip*selected_images_30_imagenet_70_babelnet_then_70_imageref_combined*+\_30_text"
- "clip*selected_images_50_imagenet_50_babelnet_then_70_imageref_combined*+\_30_text"
- clip*selected_images_100_babelnet_then_70_imageref_combined*+\_30_text
- clip*selected_images_100_imagenet_then_70_imageref_combined*+\_30_text
- "clip_selected_images_100_text"

```json
{
  "_id": {
    "$oid": "6893cfeb5bf73de064d68386"
  },
  "synset": "absorption.n.02",
  "babelnet_id": "bn:00000472n",
  "definition": "(physics) the process in which incident radiated energy is retained without reflection or transmission on passing through a medium",
  "images": [
    {
      "url": "[https://upload.wikimedia.org/wikipedia/commons/0/0f/Apsorpcioni_spektri_fotosinteti%C4%8Dkih_pigmenata.jpg](https://upload.wikimedia.org/wikipedia/commons/0/0f/Apsorpcioni_spektri_fotosinteti%C4%8Dkih_pigmenata.jpg)",
      "license": "CC_BY_SA_30",
      "source": "WIKI"
    }
  ],
  "pwn_offset": 13445356,
  "wordnet_30_offset": 13424183,
  "clip_selected_images_70_imagenet_30_babelnet_then_70_imageref_combined_+_30_text": [
    {
      "url": "[https://upload.wikimedia.org/wikipedia/commons/4/44/Absorption_spectrum_of_few_elements.PNG](https://upload.wikimedia.org/wikipedia/commons/4/44/Absorption_spectrum_of_few_elements.PNG)",
      "license": "CC BY-SA 4.0",
      "creator": "<a href=\"//commons.wikimedia.org/w/index.php?title=User:Almuazi&amp;action=edit&amp;redlink=1\" class=\"new\" title=\"User:Almuazi (page does not exist)\">Almuazi</a>",
      "provider": "Unknown",
      "source": "Wikimedia",
      "similarity_text": 0.28479957580566406,
      "similarity_imagenet": null,
      "similarity_babelnet": 0.7890658974647522,
      "similarity_used": 0.6377860009670256
    }
  ],
  "clip_selected_images_70_imagenet_30_babelnet_then_70_imageref_combined_+_30_text_strategy": "70% ImageNet, 30% BabelNet, then 70% ImageRef_Combined + 30% Text",
  "clip_selected_images_30_imagenet_70_babelnet_then_70_imageref_combined_+_30_text": [
    {
      "url": "[https://upload.wikimedia.org/wikipedia/commons/4/44/Absorption_spectrum_of_few_elements.PNG](https://upload.wikimedia.org/wikipedia/commons/4/44/Absorption_spectrum_of_few_elements.PNG)",
      "license": "CC BY-SA 4.0",
      "creator": "<a href=\"//commons.wikimedia.org/w/index.php?title=User:Almuazi&amp;action=edit&amp;redlink=1\" class=\"new\" title=\"User:Almuazi (page does not exist)\">Almuazi</a>",
      "provider": "Unknown",
      "source": "Wikimedia",
      "similarity_text": 0.28479957580566406,
      "similarity_imagenet": null,
      "similarity_babelnet": 0.7890658974647522,
      "similarity_used": 0.6377860009670256
    }
  ]
}
```

### Things to be Aware of

You would need to make an .env file at the <u>root<u> directory & you need to have with these things at the root (Tachyo) directory:

```env
BABELNET_KEY  (https://babelnet.org/login)
mongo_URI
WIKIMEDIA_ACCESS_TOKEN     (optional for more than 500 calls / hour if needed)
```

USER_AGENT is included in the config.py. Don't include in here

## File-by-File Map

```bash
master_pipeline.py              #The one that runs the full from (retrival -> CLIP Scoring -> Storing in Mongo DB)
connect_wordnet_to_babelnet     #Links WN 3.0 synsets to BabelNet IDs
CLIP_Openverse_with_imagenet    #This is where the CLIP gets run
clip_utils.py                   #These are functions to be utilized by the CLIP-Openverse_with_imagenet file
mapping_wordnet.json            #This file is the mapping between ids of  WordNet 3.1 -> 3.0
processed_synset.log            #Map between synset & BabelNet IDs
config.py                       #A configuration file including the Wikimedia API, ImageNet Folder Path, Default Number of Images to be fetched & several miscellanious things.

/diagnostics
  imagenet_exists.py            #This was an early adaption test to check if an imagenet folder exists for that synset

/image_sources
  imagenet.py                   #A utility function file to pull up the search and local download & store of ImageNet files
  openverse.py                  #A utility function file that ask to find the relevant candidate images in the OpenVerse librabry based on the synset's lemmas
  wikimedia.py                  #Similar to OpenVerse, but a different source for candidate images from Wikimedia based on synset's lemmas

/mappings
  wordnet_mapping.py            #A run to get the WordNet 3.1 -> 3.0 mapping

/mongo
  db_utils.py                      #Stores the top-k diverse CLIP results for a given synset and weighting scheme into MongoDB

```

# Workflow

![Image of the Workflow](images/Tachyo%20Image%20Integration.svg)

1. **Link WordNet → BabelNet**

   1. `connect_wordnet_to_babelnet.py` uses lemma + POS to find matching BabelNet synset IDs.
   2. Fallback: WordNet 3.1 → 3.0 mapping + gloss similarity if direct match fails.
   3. Stores `babelnet_id`, optional seed image, and offsets into `synset_images`.

2. **Retrieve Images**

   1. `openverse.py`: Queries Openverse for CC‑licensed images by lemma(s).
   2. `wikimedia.py`: Searches Wikimedia Commons; fetches license/creator info; converts SVGs if needed.
   3. `imagenet.py`: Checks if synset exists in ImageNet and embeds top‑N samples for nouns.

3. **Score & Filter (look to Modify Weights for more info...)** 

   1. `clip_utils.py`: Encodes synset text (definition + lemma + BabelNet gloss) and candidate images.
   2. Runs similarity scoring & diversity filtering to select top‑k relevant images.

4. **Store Results**

   1. Saves results to MongoDB `synset_images` collection with source, license, score, and strategy info.

## Modify Weights
1.  Go to CLIP_Openverse_with_imagenet.py
2.  Create a new weighting scheme
```python
scored_[X]I_[Y]B_T = []   #X is for the Percent Weight for ImageNet & Y is for BabelNet
```

3.  Create a Case with the use of the following template & change the `X`, `Y`. (`x` & `y` are weight in decimal: eg: 70% is 0.7 for `x` ), `z` is for the weight in decimal for text : 

```python
# Case #: [X]% ImageNet / [Y]% BabelNet (Image Ref) + Text
            sim_ref_[X]I_[Y]B = None
            if best_sim_imagenet is not None and best_sim_babelnet is not None:
                sim_ref_[X]I_[Y]B = [x] * best_sim_imagenet + [y] * best_sim_babelnet
            elif best_sim_imagenet is not None:
                sim_ref_[X]I_[Y]B = best_sim_imagenet
            elif best_sim_babelnet is not None:
                sim_ref_[X]I_[Y]B = best_sim_babelnet

            final_score_[X]I_[Y]B_T = sim_text
            if sim_ref_[X]I_[Y]B is not None:
                final_score_70I_30B_T = [x] * sim_ref_[X]I_[Y]B + [z] * sim_text

            scored_[X]I_[Y]B_T.append({
                "url": item["url"],
                "license": item["license"],
                "creator": item.get("creator"), # Use .get for safety
                "provider": item.get("provider", "Unknown"),
                "source": item.get("source", "Unknown"),
                "similarity_text": sim_text,
                "similarity_imagenet": best_sim_imagenet,
                "similarity_babelnet": best_sim_babelnet,
                "similarity_used": final_score_[X]I_[Y]B_T
            })
```

4.  Lastly, store it: 
```python
if scored_[X]I_[Y]B_T:
        store_clip_results(images_collection, synset_name, scored_[X]I_[Y]B_T,
                          weighting_scheme="[X]% ImageNet, [Y]% BabelNet, then [X]% ImageRef_Combined + [z]% Text",
                          k=5, threshold=0.85)
```

### How to Run the Code

1. Make sure the .env file is filled & go to sync folder
2. Activate a .venv Python Environment

```bash
python -m venv .venv
source .venv/bin/activate   # .venv\Scripts\activate on Windows

# Install required packages
pip install pymongo requests python-dotenv torch cairosvg Pillow tqdm numpy ftfy regex
```

3. To run the full algorithm (pick one of the following statements):

```bash

python master_pipeline.py --mode full

python master_pipeline.py --mode full --offset YOUR_SYNSET_PWN_OFFSET

python master_pipeline.py --mode full --force

python master_pipeline.py --mode full --offset YOUR_SYNSET_PWN_OFFSET --force

# --mode full
# Activates the full pipeline including:
# - BabelNet enrichment
# - WordNet 3.0 offset updates
# - ImageNet downloads (for nouns)
# - Wikimedia searches
# - All CLIP similarity calculations and storage

# --offset
# Run only for a single synset without affecting others

# --force
# Overwrite existing results
```
